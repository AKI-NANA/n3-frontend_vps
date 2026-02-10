// app/tools/amazon-research-n3/actions.ts
/**
 * Amazon Research N3 - Server Actions
 * 
 * 【Phase 4 帝国公用語準拠】
 * すべての通信は imperialSafeDispatch / imperialDirectAction 経由
 */

"use server";

import { z } from "zod";
import { 
  imperialSafeDispatch, 
  imperialDirectAction,
  createSecurePayload,
} from "@/lib/actions/imperial-fetch";
import { createClient } from "@supabase/supabase-js";
import type { AmazonResearchItem } from "./types";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase credentials not configured");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

const ASINListSchema = z.object({
  asins: z.array(z.string().regex(/^[A-Z0-9]{10}$/, "Invalid ASIN format")).min(1).max(100),
});

const EbaySearchSchema = z.object({
  keywords: z.string().min(1).max(200),
  marketplace: z.enum(["US", "UK", "DE", "AU"]).default("US"),
});

const CompetitorScanSchema = z.object({
  input: z.string().min(1),
  scanType: z.enum(["seller", "asin"]),
});

const MarketScoreSchema = z.object({
  category: z.string().min(1).max(100),
});

const ResearchAgentSchema = z.object({
  query: z.string().min(1).max(500),
  analysisType: z.enum(["keyword", "market", "competitor"]),
  options: z.object({
    includeKeywords: z.boolean().optional(),
    includeMarketScore: z.boolean().optional(),
    includeCompetitors: z.boolean().optional(),
  }).optional(),
});

const SendToCatalogSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(100),
});

export async function getResearchItems(limit: number = 200) {
  return imperialDirectAction(async () => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("amazon_research_items")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    
    if (error) throw new Error(error.message);
    return { success: true, data: data || [] };
  }, crypto.randomUUID());
}

export async function executeASINBatchResearch(asins: string[]) {
  const validated = ASINListSchema.parse({ asins });
  
  return imperialDirectAction(async () => {
    const supabase = getSupabaseAdmin();
    const results: Partial<AmazonResearchItem>[] = [];
    
    for (const asin of validated.asins) {
      const { data: existing } = await supabase
        .from("amazon_research_items")
        .select("id")
        .eq("asin", asin)
        .single();
      
      if (existing) {
        results.push({ asin, status: "exists" } as Partial<AmazonResearchItem>);
        continue;
      }
      
      const newItem = {
        asin,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from("amazon_research_items")
        .insert(newItem)
        .select()
        .single();
      
      if (error) {
        results.push({ asin, status: "error" } as Partial<AmazonResearchItem>);
      } else {
        results.push(data);
      }
    }
    
    return {
      success: true,
      total: validated.asins.length,
      completed: results.filter(r => r.status !== "error").length,
      results,
    };
  }, crypto.randomUUID());
}

export async function sendToCatalog(ids: string[]) {
  const validated = SendToCatalogSchema.parse({ ids });
  
  return imperialDirectAction(async () => {
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from("amazon_research_items")
      .update({ 
        status: "pending_catalog",
        updated_at: new Date().toISOString(),
      })
      .in("id", validated.ids)
      .select();
    
    if (error) throw new Error(error.message);
    
    return {
      success: true,
      updated: data?.length || 0,
    };
  }, crypto.randomUUID());
}

export async function createProductFromResearch(item: {
  asin: string;
  title?: string;
  image_url?: string;
  price_jpy?: number;
  brand?: string;
  category?: string;
  n3_score?: number;
}) {
  return imperialDirectAction(async () => {
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from("products")
      .insert({
        source_asin: item.asin,
        title_ja: item.title,
        main_image_url: item.image_url,
        source_price_jpy: item.price_jpy,
        brand: item.brand,
        category: item.category,
        research_score: item.n3_score,
        status: "research_pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    await supabase
      .from("amazon_research_items")
      .update({ status: "exists" })
      .eq("asin", item.asin);
    
    return { success: true, data };
  }, crypto.randomUUID());
}

export async function getAutoResearchConfigs(includeStats: boolean = false) {
  return imperialDirectAction(async () => {
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from("amazon_auto_research_configs")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw new Error(error.message);
    return { success: true, data: data || [] };
  }, crypto.randomUUID());
}

export async function runAutoResearchNow(configId: string) {
  return imperialDirectAction(async () => {
    return { success: true, processed: 0, message: "Manual execution triggered" };
  }, crypto.randomUUID());
}

export async function searchEbaySold(keywords: string, marketplace: string = "US") {
  const validated = EbaySearchSchema.parse({ keywords, marketplace });
  
  const payload = await createSecurePayload(
    "research-ebay-sold",
    "search",
    {
      targets: [validated.keywords],
      config: { marketplace: validated.marketplace },
    }
  );
  
  return imperialSafeDispatch(payload);
}

export async function scanCompetitors(input: string, scanType: "seller" | "asin") {
  const validated = CompetitorScanSchema.parse({ input, scanType });
  
  const payload = await createSecurePayload(
    "research-competitor-scan",
    "execute",
    {
      targets: [validated.input],
      config: { scanType: validated.scanType },
    }
  );
  
  return imperialSafeDispatch(payload);
}

export async function analyzeMarketScore(category: string) {
  const validated = MarketScoreSchema.parse({ category });
  
  const payload = await createSecurePayload(
    "research-market-score",
    "execute",
    {
      targets: [validated.category],
      config: {},
    }
  );
  
  return imperialSafeDispatch(payload);
}

export async function executeResearchAgent(
  query: string,
  analysisType: "keyword" | "market" | "competitor",
  options?: {
    includeKeywords?: boolean;
    includeMarketScore?: boolean;
    includeCompetitors?: boolean;
  }
) {
  const validated = ResearchAgentSchema.parse({ query, analysisType, options });
  
  const payload = await createSecurePayload(
    "research-gpt-analyze",
    "execute",
    {
      targets: [validated.query],
      config: {
        analysisType: validated.analysisType,
        ...validated.options,
      },
    }
  );
  
  return imperialSafeDispatch(payload);
}

export async function getJobStatus(jobId: string) {
  const payload = await createSecurePayload(
    "job-status",
    "get",
    {
      targets: [jobId],
      config: {},
    }
  );
  
  return imperialSafeDispatch(payload);
}
