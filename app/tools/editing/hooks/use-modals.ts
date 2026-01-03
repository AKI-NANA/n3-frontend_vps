// app/tools/editing/hooks/use-modals.ts
/**
 * モーダル管理フック
 * 
 * 責務:
 * - 全モーダルの開閉状態
 * - モーダル関連の操作
 */

import { useState, useCallback } from 'react';
import type { Product } from '../types/product';

interface UseModalsReturn {
  // 商品モーダル
  selectedProduct: Product | null;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;
  
  // ペーストモーダル
  showPasteModal: boolean;
  openPasteModal: () => void;
  closePasteModal: () => void;
  
  // CSVモーダル
  showCSVModal: boolean;
  openCSVModal: () => void;
  closeCSVModal: () => void;
  
  // AIエンリッチモーダル
  showAIEnrichModal: boolean;
  enrichTargetProduct: Product | null;
  openAIEnrichModal: (product: Product) => void;
  closeAIEnrichModal: () => void;
  
  // 市場調査モーダル
  showMarketResearchModal: boolean;
  openMarketResearchModal: () => void;
  closeMarketResearchModal: () => void;
  
  // Geminiバッチモーダル
  showGeminiBatchModal: boolean;
  openGeminiBatchModal: () => void;
  closeGeminiBatchModal: () => void;
  
  // HTMLパネル
  showHTMLPanel: boolean;
  openHTMLPanel: () => void;
  closeHTMLPanel: () => void;
  
  // 価格戦略パネル
  showPricingPanel: boolean;
  openPricingPanel: () => void;
  closePricingPanel: () => void;
  
  // 競合選択モーダル
  showCompetitorSelectionModal: boolean;
  competitorSelectionProduct: Product | null;
  openCompetitorSelectionModal: (product: Product) => void;
  closeCompetitorSelectionModal: () => void;
  
  // 商品強化フローモーダル
  showEnrichmentFlowModal: boolean;
  enrichmentFlowProduct: Product | null;
  openEnrichmentFlowModal: (product: Product) => void;
  closeEnrichmentFlowModal: () => void;
}

export function useModals(): UseModalsReturn {
  // 商品モーダル
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const openProductModal = useCallback((product: Product) => setSelectedProduct(product), []);
  const closeProductModal = useCallback(() => setSelectedProduct(null), []);
  
  // ペーストモーダル
  const [showPasteModal, setShowPasteModal] = useState(false);
  const openPasteModal = useCallback(() => setShowPasteModal(true), []);
  const closePasteModal = useCallback(() => setShowPasteModal(false), []);
  
  // CSVモーダル
  const [showCSVModal, setShowCSVModal] = useState(false);
  const openCSVModal = useCallback(() => setShowCSVModal(true), []);
  const closeCSVModal = useCallback(() => setShowCSVModal(false), []);
  
  // AIエンリッチモーダル
  const [showAIEnrichModal, setShowAIEnrichModal] = useState(false);
  const [enrichTargetProduct, setEnrichTargetProduct] = useState<Product | null>(null);
  const openAIEnrichModal = useCallback((product: Product) => {
    setEnrichTargetProduct(product);
    setShowAIEnrichModal(true);
  }, []);
  const closeAIEnrichModal = useCallback(() => {
    setShowAIEnrichModal(false);
    setEnrichTargetProduct(null);
  }, []);
  
  // 市場調査モーダル
  const [showMarketResearchModal, setShowMarketResearchModal] = useState(false);
  const openMarketResearchModal = useCallback(() => setShowMarketResearchModal(true), []);
  const closeMarketResearchModal = useCallback(() => setShowMarketResearchModal(false), []);
  
  // Geminiバッチモーダル
  const [showGeminiBatchModal, setShowGeminiBatchModal] = useState(false);
  const openGeminiBatchModal = useCallback(() => setShowGeminiBatchModal(true), []);
  const closeGeminiBatchModal = useCallback(() => setShowGeminiBatchModal(false), []);
  
  // HTMLパネル
  const [showHTMLPanel, setShowHTMLPanel] = useState(false);
  const openHTMLPanel = useCallback(() => setShowHTMLPanel(true), []);
  const closeHTMLPanel = useCallback(() => setShowHTMLPanel(false), []);
  
  // 価格戦略パネル
  const [showPricingPanel, setShowPricingPanel] = useState(false);
  const openPricingPanel = useCallback(() => setShowPricingPanel(true), []);
  const closePricingPanel = useCallback(() => setShowPricingPanel(false), []);
  
  // 競合選択モーダル
  const [showCompetitorSelectionModal, setShowCompetitorSelectionModal] = useState(false);
  const [competitorSelectionProduct, setCompetitorSelectionProduct] = useState<Product | null>(null);
  const openCompetitorSelectionModal = useCallback((product: Product) => {
    setCompetitorSelectionProduct(product);
    setShowCompetitorSelectionModal(true);
  }, []);
  const closeCompetitorSelectionModal = useCallback(() => {
    setShowCompetitorSelectionModal(false);
    setCompetitorSelectionProduct(null);
  }, []);
  
  // 商品強化フローモーダル
  const [showEnrichmentFlowModal, setShowEnrichmentFlowModal] = useState(false);
  const [enrichmentFlowProduct, setEnrichmentFlowProduct] = useState<Product | null>(null);
  const openEnrichmentFlowModal = useCallback((product: Product) => {
    setEnrichmentFlowProduct(product);
    setShowEnrichmentFlowModal(true);
  }, []);
  const closeEnrichmentFlowModal = useCallback(() => {
    setShowEnrichmentFlowModal(false);
    setEnrichmentFlowProduct(null);
  }, []);

  return {
    selectedProduct,
    openProductModal,
    closeProductModal,
    showPasteModal,
    openPasteModal,
    closePasteModal,
    showCSVModal,
    openCSVModal,
    closeCSVModal,
    showAIEnrichModal,
    enrichTargetProduct,
    openAIEnrichModal,
    closeAIEnrichModal,
    showMarketResearchModal,
    openMarketResearchModal,
    closeMarketResearchModal,
    showGeminiBatchModal,
    openGeminiBatchModal,
    closeGeminiBatchModal,
    showHTMLPanel,
    openHTMLPanel,
    closeHTMLPanel,
    showPricingPanel,
    openPricingPanel,
    closePricingPanel,
    showCompetitorSelectionModal,
    competitorSelectionProduct,
    openCompetitorSelectionModal,
    closeCompetitorSelectionModal,
    showEnrichmentFlowModal,
    enrichmentFlowProduct,
    openEnrichmentFlowModal,
    closeEnrichmentFlowModal,
  };
}
