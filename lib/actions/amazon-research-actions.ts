// lib/actions/amazon-research-actions.ts
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
import type { ImperialResponse } from "@/lib/contracts/protocol";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase credentials not configured");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

const FetchItemsSchema = z.object({
  limit: z.number().min(1).max(1000).default(200),
});

const ASINListSchema = z.object({
  asins: z.array(z.string().regex(/^[A-Z0-9]{10}$/, "Invalid ASIN format")).min(1).max(100),
});

const SendToCatalogSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(100),
});

const CreateProductSchema = z.object({
  asin: z.string().regex(/^[A-Z0-9]{10}$/),
  title: z.string().optional(),
  image_url: z.string().url().optional(),
  price_jpy: z.number().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  n3_score: z.number().optional(),
});

const AutoConfigUpdateSchema = z.object({
  id: z.string().uuid(),
  enabled: z.boolean().optional(),
  name: z.string().optional(),
  schedule_type: z.string().optional(),
  schedule_time: z.string().optional(),
});

export async function fetchResearchItems(options: { limit?: number } = {}): Promise<ImperialResponse> {
  const validated = FetchItemsSchema.parse(options);
  
  return imperialDirectAction(async () => {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("amazon_research_items")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(validated.limit);
    
    if (error) throw new Error(error.message);
    return data || [];
  }, crypto.randomUUID());
}

export async function executeResearchBatch(asins: string[]): Promise<ImperialResponse> {
  const validated = ASINListSchema.parse({ asins });
  
  return imperialDirectAction(async () => {
    const supabase = getSupabaseAdmin();
    
    const results: Array<{ asin: string; status: string; id?: string }> = [];
    let completed = 0;
    
    for (const asin of validated.asins) {
      const { data: existing } = await supabase
        .from("amazon_research_items")
        .select("id")
        .eq("asin", asin)
        .single();
      
      if (existing) {
        results.push({ asin, status: "exists", id: existing.id });
        completed++;
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
        results.push({ asin, status: "error" });
      } else {
        results.push({ asin, status: "completed", id: data.id });
        completed++;
      }
    }
    
    return {
      total: validated.asins.length,
      completed,
      results,
    };
  }, crypto.randomUUID());
}

export async function sendToCatalog(ids: string[]): Promise<ImperialResponse> {
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
}): Promise<ImperialResponse> {
  const validated = CreateProductSchema.parse(item);
  
  return imperialDirectAction(async () => {
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from("products")
      .insert({
        source_asin: validated.asin,
        title_ja: validated.title,
        main_image_url: validated.image_url,
        source_price_jpy: validated.price_jpy,
        brand: validated.brand,
        category: validated.category,
        research_score: validated.n3_score,
        status: "research_pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    
    await supabase
      .from("amazon_research_items")
      .update({ status: "exists" })
      .eq("asin", validated.asin);
    
    return data;
  }, crypto.randomUUID());
}

export async function fetchAutoConfigs(includeStats: boolean = false): Promise<ImperialResponse> {
  return imperialDirectAction(async () => {
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from("amazon_auto_research_configs")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) throw new Error(error.message);
    return data || [];
  }, crypto.randomUUID());
}

export async function updateAutoConfig(updates: {
  id: string;
  enabled?: boolean;
  name?: string;
  schedule_type?: string;
  schedule_time?: string;
}): Promise<ImperialResponse> {
  const validated = AutoConfigUpdateSchema.parse(updates);
  
  return imperialDirectAction(async () => {
    const supabase = getSupabaseAdmin();
    
    const { id, ...updateData } = validated;
    
    const { data, error } = await supabase
      .from("amazon_auto_research_configs")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }, crypto.randomUUID());
}

export async function executeCronResearch(configId: string): Promise<ImperialResponse> {
  const payload = await createSecurePayload(
    "amazon-auto-research",
    "execute",
    {
      targets: [configId],
      config: {},
    }
  );
  
  return imperialSafeDispatch(payload);
}
