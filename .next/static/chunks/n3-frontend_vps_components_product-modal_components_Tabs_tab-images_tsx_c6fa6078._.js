(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TabImages",
    ()=>TabImages
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// TabImages - V9.1
// デザインシステムV4準拠
// 機能: 
// - 画像選択、順序設定、処理設定、DB保存
// - ドラッグ&ドロップアップロード機能
// - SM画像の完全除外
// - 画像削除機能
// 
// V9.1: useEffect無限ループ修正
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const T = {
    bg: '#F1F5F9',
    panel: '#ffffff',
    panelBorder: '#e2e8f0',
    highlight: '#f1f5f9',
    text: '#1e293b',
    textMuted: '#64748b',
    textSubtle: '#94a3b8',
    accent: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
};
/**
 * SM画像のURLパターンを判定
 */ function isSMImageUrl(url) {
    if (!url) return false;
    const smPatterns = [
        'surugaya',
        'mandarake',
        'mercari',
        'yahoo.co.jp',
        'auctions.yahoo',
        'rakuten.co.jp',
        'amazon.co.jp',
        'amazon.com',
        'ebay.com/itm',
        'i.ebayimg.com'
    ];
    const urlLower = url.toLowerCase();
    return smPatterns.some((pattern)=>urlLower.includes(pattern));
}
/**
 * URLを正規化してユニークキーを生成
 */ function normalizeUrl(url) {
    try {
        const parsed = new URL(url);
        return "".concat(parsed.origin).concat(parsed.pathname).toLowerCase();
    } catch (e) {
        return url.split('?')[0].toLowerCase();
    }
}
function TabImages(param) {
    let { product, maxImages, marketplace, onSave, onRefresh } = param;
    var _this, _this1, _this2, _this3, _this4, _this5, _this6, _listing_data, _this7;
    _s();
    const [selectedImageIds, setSelectedImageIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [deletedUrls, setDeletedUrls] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set()); // 削除済みURLを追跡
    const [imageSettings, setImageSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        resize: true,
        optimize: true,
        watermark: false
    });
    const [isUploading, setIsUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [uploadProgress, setUploadProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isDragOver, setIsDragOver] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [deleteConfirm, setDeleteConfirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // 前回の商品IDを追跡
    const prevProductIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    /**
   * 利用可能な画像を取得（useMemoで安定化）
   * 削除済みURLを除外
   */ const availableImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "TabImages.useMemo[availableImages]": ()=>{
            var _listing_data;
            if (!product) return [];
            const images = [];
            const seen = new Set();
            const addImage = {
                "TabImages.useMemo[availableImages].addImage": function(url, source, idx) {
                    let canDelete = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
                    if (!url || typeof url !== 'string') return;
                    if (!url.startsWith('http')) return;
                    // 削除済みのURLはスキップ
                    if (deletedUrls.has(url)) {
                        console.log("[スキップ] 削除済み: ".concat(url.substring(0, 50), "..."));
                        return;
                    }
                    if (isSMImageUrl(url)) {
                        return;
                    }
                    const normalizedUrl = normalizeUrl(url);
                    if (!seen.has(normalizedUrl)) {
                        seen.add(normalizedUrl);
                        images.push({
                            id: "".concat(source, "-").concat(idx),
                            url: url,
                            source: source,
                            canDelete: canDelete || source === 'manual' || url.includes('supabase')
                        });
                    }
                }
            }["TabImages.useMemo[availableImages].addImage"];
            const imageSources = [
                {
                    data: product.manual_images,
                    name: 'manual',
                    canDelete: true
                },
                {
                    data: product.listing_images,
                    name: 'listing_selected',
                    canDelete: false
                },
                {
                    data: product.gallery_images,
                    name: 'gallery',
                    canDelete: true
                },
                {
                    data: product.primary_image_url ? [
                        product.primary_image_url
                    ] : [],
                    name: 'primary',
                    canDelete: true
                },
                {
                    data: product.supplier_images,
                    name: 'supplier',
                    canDelete: true
                },
                {
                    data: product.images,
                    name: 'images',
                    canDelete: false
                },
                {
                    data: product.image_urls,
                    name: 'image_urls',
                    canDelete: false
                },
                {
                    data: (_listing_data = product.listing_data) === null || _listing_data === void 0 ? void 0 : _listing_data.image_urls,
                    name: 'listing',
                    canDelete: false
                }
            ];
            imageSources.forEach({
                "TabImages.useMemo[availableImages]": (source)=>{
                    if (!source.data) return;
                    if (Array.isArray(source.data)) {
                        source.data.forEach({
                            "TabImages.useMemo[availableImages]": (img, idx)=>{
                                if (typeof img === 'string') {
                                    addImage(img, source.name, idx, source.canDelete);
                                } else if (typeof img === 'object' && img !== null) {
                                    addImage(img.url || img.original || img.src, source.name, idx, source.canDelete);
                                }
                            }
                        }["TabImages.useMemo[availableImages]"]);
                    } else if (typeof source.data === 'string') {
                        addImage(source.data, source.name, 0, source.canDelete);
                    }
                }
            }["TabImages.useMemo[availableImages]"]);
            return images;
        // deletedUrlsを依存配列に追加
        }
    }["TabImages.useMemo[availableImages]"], [
        JSON.stringify({
            id: product === null || product === void 0 ? void 0 : product.id,
            manual_images: (_this = product) === null || _this === void 0 ? void 0 : _this.manual_images,
            listing_images: (_this1 = product) === null || _this1 === void 0 ? void 0 : _this1.listing_images,
            gallery_images: (_this2 = product) === null || _this2 === void 0 ? void 0 : _this2.gallery_images,
            primary_image_url: (_this3 = product) === null || _this3 === void 0 ? void 0 : _this3.primary_image_url,
            supplier_images: (_this4 = product) === null || _this4 === void 0 ? void 0 : _this4.supplier_images,
            images: (_this5 = product) === null || _this5 === void 0 ? void 0 : _this5.images,
            image_urls: (_this6 = product) === null || _this6 === void 0 ? void 0 : _this6.image_urls,
            listing_data_images: (_this7 = product) === null || _this7 === void 0 ? void 0 : (_listing_data = _this7.listing_data) === null || _listing_data === void 0 ? void 0 : _listing_data.image_urls
        }),
        deletedUrls.size
    ]); // deletedUrls.sizeを依存配列に追加
    // 商品IDが変わった時のみ選択状態を初期化
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TabImages.useEffect": ()=>{
            var _listing_data, _this, _this1, _this2;
            const currentProductId = product === null || product === void 0 ? void 0 : product.id;
            // 商品IDが変わっていない場合は何もしない
            if (currentProductId === prevProductIdRef.current) {
                return;
            }
            prevProductIdRef.current = currentProductId;
            // 商品が変わったら削除済みURLをリセット
            setDeletedUrls(new Set());
            if (!product) {
                setSelectedImageIds([]);
                return;
            }
            const existing = ((_this = product) === null || _this === void 0 ? void 0 : (_listing_data = _this.listing_data) === null || _listing_data === void 0 ? void 0 : _listing_data.image_urls) || ((_this1 = product) === null || _this1 === void 0 ? void 0 : _this1.listing_images) || ((_this2 = product) === null || _this2 === void 0 ? void 0 : _this2.gallery_images) || [];
            if (Array.isArray(existing) && existing.length > 0) {
                const imageMap = new Map();
                availableImages.forEach({
                    "TabImages.useEffect": (img)=>{
                        imageMap.set(img.url, img.id);
                    }
                }["TabImages.useEffect"]);
                const ids = existing.map({
                    "TabImages.useEffect.ids": (url)=>imageMap.get(url)
                }["TabImages.useEffect.ids"]).filter(Boolean);
                setSelectedImageIds(ids);
            } else {
                setSelectedImageIds([]);
            }
        }
    }["TabImages.useEffect"], [
        product === null || product === void 0 ? void 0 : product.id,
        availableImages
    ]);
    const toggleImage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabImages.useCallback[toggleImage]": (imageId)=>{
            setSelectedImageIds({
                "TabImages.useCallback[toggleImage]": (prev)=>{
                    if (prev.includes(imageId)) {
                        return prev.filter({
                            "TabImages.useCallback[toggleImage]": (id)=>id !== imageId
                        }["TabImages.useCallback[toggleImage]"]);
                    } else {
                        if (prev.length >= maxImages) {
                            alert("".concat(marketplace.toUpperCase(), "では最大").concat(maxImages, "枚まで"));
                            return prev;
                        }
                        return [
                            ...prev,
                            imageId
                        ];
                    }
                }
            }["TabImages.useCallback[toggleImage]"]);
        }
    }["TabImages.useCallback[toggleImage]"], [
        maxImages,
        marketplace
    ]);
    const selectAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabImages.useCallback[selectAll]": ()=>{
            setSelectedImageIds(availableImages.slice(0, maxImages).map({
                "TabImages.useCallback[selectAll]": (img)=>img.id
            }["TabImages.useCallback[selectAll]"]));
        }
    }["TabImages.useCallback[selectAll]"], [
        availableImages,
        maxImages
    ]);
    const clearAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabImages.useCallback[clearAll]": ()=>{
            setSelectedImageIds([]);
        }
    }["TabImages.useCallback[clearAll]"], []);
    /**
   * 画像アップロード処理
   */ const handleUpload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabImages.useCallback[handleUpload]": async (files)=>{
            if (!(product === null || product === void 0 ? void 0 : product.id)) {
                alert('商品を選択してください');
                return;
            }
            const fileArray = Array.from(files);
            if (fileArray.length === 0) return;
            setIsUploading(true);
            setUploadProgress("0/".concat(fileArray.length, " アップロード中..."));
            try {
                const formData = new FormData();
                fileArray.forEach({
                    "TabImages.useCallback[handleUpload]": (file)=>formData.append('files', file)
                }["TabImages.useCallback[handleUpload]"]);
                formData.append('productId', String(product.id));
                formData.append('imageType', 'manual');
                const response = await fetch('/api/products/upload-image', {
                    method: 'PUT',
                    body: formData
                });
                const result = await response.json();
                if (result.success) {
                    setUploadProgress("".concat(result.uploaded, "枚アップロード完了"));
                    if (onRefresh) {
                        onRefresh();
                    }
                    setTimeout({
                        "TabImages.useCallback[handleUpload]": ()=>{
                            setUploadProgress('');
                            setIsUploading(false);
                        }
                    }["TabImages.useCallback[handleUpload]"], 2000);
                } else {
                    throw new Error(result.error || 'アップロードに失敗しました');
                }
            } catch (error) {
                console.error('Upload error:', error);
                alert("アップロードエラー: ".concat(error.message));
                setIsUploading(false);
                setUploadProgress('');
            }
        }
    }["TabImages.useCallback[handleUpload]"], [
        product === null || product === void 0 ? void 0 : product.id,
        onRefresh
    ]);
    /**
   * 画像削除処理
   */ const handleDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabImages.useCallback[handleDelete]": async (imageUrl)=>{
            if (!(product === null || product === void 0 ? void 0 : product.id)) return;
            console.log('\n========== 画像削除開始 ==========');
            console.log('削除対象URL:', imageUrl);
            console.log('商品ID:', product.id);
            try {
                const response = await fetch('/api/products/upload-image', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        imageUrl,
                        productId: product.id
                    })
                });
                const result = await response.json();
                console.log('APIレスポンス:', result);
                if (result.success) {
                    console.log('✅ 削除成功');
                    // 🔥 削除済みURLをローカルステートに追加（即時UI更新）
                    setDeletedUrls({
                        "TabImages.useCallback[handleDelete]": (prev)=>new Set([
                                ...prev,
                                imageUrl
                            ])
                    }["TabImages.useCallback[handleDelete]"]);
                    // 選択から削除
                    const imgToRemove = availableImages.find({
                        "TabImages.useCallback[handleDelete].imgToRemove": (img)=>img.url === imageUrl
                    }["TabImages.useCallback[handleDelete].imgToRemove"]);
                    if (imgToRemove) {
                        setSelectedImageIds({
                            "TabImages.useCallback[handleDelete]": (prev)=>prev.filter({
                                    "TabImages.useCallback[handleDelete]": (id)=>id !== imgToRemove.id
                                }["TabImages.useCallback[handleDelete]"])
                        }["TabImages.useCallback[handleDelete]"]);
                    }
                    // 親コンポーネントに更新を通知
                    if (onRefresh) {
                        onRefresh();
                    }
                    setDeleteConfirm(null);
                } else {
                    throw new Error(result.error || '削除に失敗しました');
                }
            } catch (error) {
                console.error('❌ Delete error:', error);
                alert("削除エラー: ".concat(error.message));
            }
            console.log('========== 画像削除終了 ==========\n');
        }
    }["TabImages.useCallback[handleDelete]"], [
        product === null || product === void 0 ? void 0 : product.id,
        availableImages,
        onRefresh
    ]);
    /**
   * ドラッグ&ドロップハンドラ
   */ const handleDragOver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabImages.useCallback[handleDragOver]": (e)=>{
            e.preventDefault();
            e.stopPropagation();
            setIsDragOver(true);
        }
    }["TabImages.useCallback[handleDragOver]"], []);
    const handleDragLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabImages.useCallback[handleDragLeave]": (e)=>{
            e.preventDefault();
            e.stopPropagation();
            setIsDragOver(false);
        }
    }["TabImages.useCallback[handleDragLeave]"], []);
    const handleDrop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabImages.useCallback[handleDrop]": (e)=>{
            e.preventDefault();
            e.stopPropagation();
            setIsDragOver(false);
            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
                const imageFiles = Array.from(files).filter({
                    "TabImages.useCallback[handleDrop].imageFiles": (file)=>file.type.startsWith('image/')
                }["TabImages.useCallback[handleDrop].imageFiles"]);
                if (imageFiles.length > 0) {
                    handleUpload(imageFiles);
                } else {
                    alert('画像ファイルのみアップロードできます');
                }
            }
        }
    }["TabImages.useCallback[handleDrop]"], [
        handleUpload
    ]);
    const handleFileSelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabImages.useCallback[handleFileSelect]": (e)=>{
            const files = e.target.files;
            if (files && files.length > 0) {
                handleUpload(files);
            }
            e.target.value = '';
        }
    }["TabImages.useCallback[handleFileSelect]"], [
        handleUpload
    ]);
    const handleSave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TabImages.useCallback[handleSave]": async ()=>{
            const urls = availableImages.filter({
                "TabImages.useCallback[handleSave].urls": (img)=>selectedImageIds.includes(img.id)
            }["TabImages.useCallback[handleSave].urls"]).map({
                "TabImages.useCallback[handleSave].urls": (img)=>img.url
            }["TabImages.useCallback[handleSave].urls"]);
            if (product === null || product === void 0 ? void 0 : product.id) {
                try {
                    var _this, _urls_;
                    // ⚠️ 重要: 複数のカラムを同時に更新
                    const updates = {
                        listing_images: urls,
                        gallery_images: urls,
                        // 🔥 primary_image_urlを最初の画像に設定（リスト画面のサムネイル用）
                        primary_image_url: urls.length > 0 ? urls[0] : null,
                        // 🔥 listing_data内の画像情報も更新
                        listing_data: {
                            ...(_this = product) === null || _this === void 0 ? void 0 : _this.listing_data,
                            image_urls: urls,
                            image_count: urls.length,
                            image_settings: imageSettings,
                            primary_image: urls.length > 0 ? urls[0] : null
                        }
                    };
                    console.log('💾 画像保存開始:', {
                        productId: product.id,
                        imageCount: urls.length,
                        primaryImage: ((_urls_ = urls[0]) === null || _urls_ === void 0 ? void 0 : _urls_.substring(0, 50)) + '...',
                        updates: Object.keys(updates)
                    });
                    const response = await fetch('/api/products/update', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id: product.id,
                            updates
                        })
                    });
                    const result = await response.json();
                    if (response.ok && result.success) {
                        console.log('✅ 画像保存成功');
                        alert("✓ ".concat(urls.length, "枚の画像を保存しました"));
                        // 親コンポーネントに通知
                        if (onSave) {
                            onSave({
                                listing_images: urls,
                                primary_image_url: urls[0] || null,
                                gallery_images: urls
                            });
                        }
                        // リフレッシュ
                        if (onRefresh) {
                            onRefresh();
                        }
                    } else {
                        throw new Error(result.error || '保存に失敗しました');
                    }
                } catch (error) {
                    console.error('❌ 保存エラー:', error);
                    alert("保存エラー: ".concat(error.message));
                }
            }
        }
    }["TabImages.useCallback[handleSave]"], [
        availableImages,
        selectedImageIds,
        product,
        imageSettings,
        onSave,
        onRefresh
    ]);
    if (!product) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '2rem',
                textAlign: 'center',
                color: T.textMuted
            },
            children: "商品データがありません"
        }, void 0, false, {
            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
            lineNumber: 440,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '1rem',
            background: T.bg,
            height: '100%',
            overflow: 'auto'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.75rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: '11px',
                            fontWeight: 700,
                            color: T.text
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fas fa-images",
                                style: {
                                    marginRight: '0.375rem'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                lineNumber: 448,
                                columnNumber: 11
                            }, this),
                            "Image Selection"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                        lineNumber: 447,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '0.25rem 0.5rem',
                            fontSize: '10px',
                            fontWeight: 600,
                            borderRadius: '4px',
                            background: "".concat(T.accent, "20"),
                            color: T.accent
                        },
                        children: [
                            marketplace.toUpperCase(),
                            ": Max ",
                            maxImages
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                        lineNumber: 451,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                lineNumber: 446,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onDragOver: handleDragOver,
                onDragLeave: handleDragLeave,
                onDrop: handleDrop,
                onClick: ()=>{
                    var _fileInputRef_current;
                    return (_fileInputRef_current = fileInputRef.current) === null || _fileInputRef_current === void 0 ? void 0 : _fileInputRef_current.click();
                },
                style: {
                    padding: '1rem',
                    marginBottom: '0.75rem',
                    borderRadius: '6px',
                    border: "2px dashed ".concat(isDragOver ? T.accent : T.panelBorder),
                    background: isDragOver ? "".concat(T.accent, "10") : T.panel,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        ref: fileInputRef,
                        type: "file",
                        multiple: true,
                        accept: "image/*",
                        onChange: handleFileSelect,
                        style: {
                            display: 'none'
                        }
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                        lineNumber: 480,
                        columnNumber: 9
                    }, this),
                    isUploading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-5 h-5 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2",
                                style: {
                                    borderColor: T.accent
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                lineNumber: 490,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '11px',
                                    color: T.accent,
                                    fontWeight: 600
                                },
                                children: uploadProgress
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                lineNumber: 491,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                        lineNumber: 489,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fas fa-cloud-upload-alt",
                                style: {
                                    fontSize: '1.5rem',
                                    color: isDragOver ? T.accent : T.textMuted,
                                    marginBottom: '0.25rem',
                                    display: 'block'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                lineNumber: 495,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '10px',
                                    color: T.textMuted
                                },
                                children: "ドラッグ&ドロップまたはクリックで画像を追加"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                lineNumber: 496,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '9px',
                                    color: T.textSubtle,
                                    marginTop: '0.25rem'
                                },
                                children: "JPEG, PNG, GIF, WebP（最大10MB）"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                lineNumber: 499,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                lineNumber: 464,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '0.75rem',
                            borderRadius: '6px',
                            background: T.panel,
                            border: "1px solid ".concat(T.panelBorder)
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '0.5rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '9px',
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            color: T.textSubtle
                                        },
                                        children: [
                                            "Available (",
                                            availableImages.length,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                        lineNumber: 512,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: selectAll,
                                        style: {
                                            padding: '0.2rem 0.5rem',
                                            fontSize: '9px',
                                            fontWeight: 600,
                                            borderRadius: '4px',
                                            border: 'none',
                                            background: T.accent,
                                            color: '#fff',
                                            cursor: 'pointer'
                                        },
                                        children: "Select All"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                        lineNumber: 515,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                lineNumber: 511,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                    gap: '0.375rem'
                                },
                                children: availableImages.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        gridColumn: '1 / -1',
                                        padding: '1.5rem',
                                        textAlign: 'center',
                                        color: T.textMuted,
                                        fontSize: '11px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fas fa-image",
                                            style: {
                                                fontSize: '1.5rem',
                                                marginBottom: '0.5rem',
                                                display: 'block'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                            lineNumber: 532,
                                            columnNumber: 17
                                        }, this),
                                        "No images"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                    lineNumber: 531,
                                    columnNumber: 15
                                }, this) : availableImages.map((img, idx)=>{
                                    const isSelected = selectedImageIds.includes(img.id);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            aspectRatio: '1',
                                            borderRadius: '4px',
                                            overflow: 'hidden',
                                            border: "2px solid ".concat(isSelected ? T.success : T.panelBorder),
                                            cursor: 'pointer',
                                            position: 'relative'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: img.url,
                                                alt: "",
                                                style: {
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                },
                                                onClick: ()=>toggleImage(img.id)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                                lineNumber: 550,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    position: 'absolute',
                                                    top: '2px',
                                                    left: '2px',
                                                    padding: '1px 4px',
                                                    fontSize: '8px',
                                                    fontWeight: 700,
                                                    borderRadius: '2px',
                                                    background: 'rgba(0,0,0,0.7)',
                                                    color: '#fff'
                                                },
                                                children: idx + 1
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                                lineNumber: 556,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    position: 'absolute',
                                                    bottom: '2px',
                                                    left: '2px',
                                                    padding: '1px 3px',
                                                    fontSize: '7px',
                                                    fontWeight: 600,
                                                    borderRadius: '2px',
                                                    background: img.source === 'manual' ? T.success : img.source === 'supplier' ? T.warning : 'rgba(0,0,0,0.6)',
                                                    color: '#fff'
                                                },
                                                children: img.source.substring(0, 3).toUpperCase()
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                                lineNumber: 570,
                                                columnNumber: 21
                                            }, this),
                                            img.canDelete && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: (e)=>{
                                                    e.stopPropagation();
                                                    setDeleteConfirm(img.url);
                                                },
                                                style: {
                                                    position: 'absolute',
                                                    top: '2px',
                                                    right: '2px',
                                                    width: '16px',
                                                    height: '16px',
                                                    borderRadius: '50%',
                                                    border: 'none',
                                                    background: T.error,
                                                    color: '#fff',
                                                    fontSize: '10px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    opacity: 0.8
                                                },
                                                children: "×"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                                lineNumber: 587,
                                                columnNumber: 23
                                            }, this),
                                            isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    color: T.success,
                                                    fontSize: '1.25rem',
                                                    textShadow: '0 1px 3px rgba(0,0,0,0.5)'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fas fa-check-circle"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                                    lineNumber: 623,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                                lineNumber: 614,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, img.id, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                        lineNumber: 539,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                lineNumber: 529,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                        lineNumber: 510,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '0.75rem',
                                    borderRadius: '6px',
                                    background: T.panel,
                                    border: "1px solid ".concat(T.panelBorder)
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '0.5rem'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '9px',
                                                    textTransform: 'uppercase',
                                                    fontWeight: 600,
                                                    color: T.textSubtle
                                                },
                                                children: [
                                                    "Selected (",
                                                    selectedImageIds.length,
                                                    "/",
                                                    maxImages,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                                lineNumber: 638,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: clearAll,
                                                style: {
                                                    padding: '0.2rem 0.5rem',
                                                    fontSize: '9px',
                                                    fontWeight: 600,
                                                    borderRadius: '4px',
                                                    border: 'none',
                                                    background: T.error,
                                                    color: '#fff',
                                                    cursor: 'pointer'
                                                },
                                                children: "Clear"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                                lineNumber: 641,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                        lineNumber: 637,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(4, 1fr)',
                                            gap: '0.375rem'
                                        },
                                        children: selectedImageIds.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                gridColumn: '1 / -1',
                                                padding: '1rem',
                                                textAlign: 'center',
                                                color: T.textMuted,
                                                fontSize: '10px'
                                            },
                                            children: "Select images from left"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                            lineNumber: 657,
                                            columnNumber: 17
                                        }, this) : selectedImageIds.map((imgId, idx)=>{
                                            const img = availableImages.find((i)=>i.id === imgId);
                                            if (!img) return null;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    aspectRatio: '1',
                                                    borderRadius: '4px',
                                                    overflow: 'hidden',
                                                    border: "2px solid ".concat(T.success),
                                                    position: 'relative'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        src: img.url,
                                                        alt: "",
                                                        style: {
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                                        lineNumber: 672,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            position: 'absolute',
                                                            top: '2px',
                                                            left: '2px',
                                                            padding: '1px 4px',
                                                            fontSize: '8px',
                                                            fontWeight: 700,
                                                            borderRadius: '2px',
                                                            background: T.success,
                                                            color: '#fff'
                                                        },
                                                        children: idx + 1
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                                        lineNumber: 673,
                                                        columnNumber: 23
                                                    }, this),
                                                    idx === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            position: 'absolute',
                                                            bottom: '2px',
                                                            left: '50%',
                                                            transform: 'translateX(-50%)',
                                                            padding: '1px 4px',
                                                            fontSize: '7px',
                                                            fontWeight: 700,
                                                            borderRadius: '2px',
                                                            background: T.accent,
                                                            color: '#fff'
                                                        },
                                                        children: "MAIN"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                                        lineNumber: 687,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, imgId, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                                lineNumber: 665,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                        lineNumber: 655,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                lineNumber: 636,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '0.75rem',
                                    borderRadius: '6px',
                                    background: T.panel,
                                    border: "1px solid ".concat(T.panelBorder)
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: '9px',
                                            textTransform: 'uppercase',
                                            fontWeight: 600,
                                            color: T.textSubtle,
                                            marginBottom: '0.5rem'
                                        },
                                        children: "Processing Options"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                        lineNumber: 711,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.375rem'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Checkbox, {
                                                label: "Resize to 1600x1600px",
                                                checked: imageSettings.resize,
                                                onChange: (v)=>setImageSettings((p)=>({
                                                            ...p,
                                                            resize: v
                                                        }))
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                                lineNumber: 715,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Checkbox, {
                                                label: "Optimize file size",
                                                checked: imageSettings.optimize,
                                                onChange: (v)=>setImageSettings((p)=>({
                                                            ...p,
                                                            optimize: v
                                                        }))
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                                lineNumber: 716,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Checkbox, {
                                                label: "Add watermark",
                                                checked: imageSettings.watermark,
                                                onChange: (v)=>setImageSettings((p)=>({
                                                            ...p,
                                                            watermark: v
                                                        }))
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                                lineNumber: 717,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                        lineNumber: 714,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                lineNumber: 710,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: '6px',
                                    background: T.highlight,
                                    fontSize: '9px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontWeight: 600,
                                            marginBottom: '0.25rem',
                                            color: T.text
                                        },
                                        children: "Image Sources:"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                        lineNumber: 723,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            gap: '0.75rem',
                                            flexWrap: 'wrap',
                                            color: T.textMuted
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            display: 'inline-block',
                                                            width: '8px',
                                                            height: '8px',
                                                            borderRadius: '2px',
                                                            background: T.success,
                                                            marginRight: '3px'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                                        lineNumber: 725,
                                                        columnNumber: 21
                                                    }, this),
                                                    "Manual"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                                lineNumber: 725,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            display: 'inline-block',
                                                            width: '8px',
                                                            height: '8px',
                                                            borderRadius: '2px',
                                                            background: T.warning,
                                                            marginRight: '3px'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                                        lineNumber: 726,
                                                        columnNumber: 21
                                                    }, this),
                                                    "Supplier"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                                lineNumber: 726,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            display: 'inline-block',
                                                            width: '8px',
                                                            height: '8px',
                                                            borderRadius: '2px',
                                                            background: 'rgba(0,0,0,0.6)',
                                                            marginRight: '3px'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                                        lineNumber: 727,
                                                        columnNumber: 21
                                                    }, this),
                                                    "Other"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                                lineNumber: 727,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                        lineNumber: 724,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                lineNumber: 722,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSave,
                                style: {
                                    padding: '0.5rem 1rem',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    borderRadius: '4px',
                                    border: 'none',
                                    background: '#1e293b',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.25rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fas fa-save"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                        lineNumber: 746,
                                        columnNumber: 13
                                    }, this),
                                    " Save Images"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                lineNumber: 732,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                        lineNumber: 634,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                lineNumber: 507,
                columnNumber: 7
            }, this),
            deleteConfirm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: T.panel,
                        padding: '1.5rem',
                        borderRadius: '8px',
                        maxWidth: '400px',
                        width: '90%'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: '13px',
                                fontWeight: 600,
                                marginBottom: '1rem',
                                color: T.text
                            },
                            children: "画像を削除しますか？"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                            lineNumber: 772,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                marginBottom: '1rem'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: deleteConfirm,
                                alt: "",
                                style: {
                                    width: '100%',
                                    maxHeight: '150px',
                                    objectFit: 'contain',
                                    borderRadius: '4px',
                                    background: T.bg
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                lineNumber: 776,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                            lineNumber: 775,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: '10px',
                                color: T.textMuted,
                                marginBottom: '1rem'
                            },
                            children: "この操作は取り消せません。Supabase Storageからも削除されます。"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                            lineNumber: 788,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                gap: '0.5rem',
                                justifyContent: 'flex-end'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setDeleteConfirm(null),
                                    style: {
                                        padding: '0.4rem 1rem',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        borderRadius: '4px',
                                        border: "1px solid ".concat(T.panelBorder),
                                        background: T.panel,
                                        color: T.text,
                                        cursor: 'pointer'
                                    },
                                    children: "キャンセル"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                    lineNumber: 792,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleDelete(deleteConfirm),
                                    style: {
                                        padding: '0.4rem 1rem',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        borderRadius: '4px',
                                        border: 'none',
                                        background: T.error,
                                        color: '#fff',
                                        cursor: 'pointer'
                                    },
                                    children: "削除する"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                                    lineNumber: 807,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                            lineNumber: 791,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                    lineNumber: 765,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                lineNumber: 753,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
        lineNumber: 444,
        columnNumber: 5
    }, this);
}
_s(TabImages, "JFdgYEFis1Ihg1EDdBOrSFYXifM=");
_c = TabImages;
function Checkbox(param) {
    let { label, checked, onChange } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        style: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            cursor: 'pointer',
            fontSize: '10px',
            color: T.text
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "checkbox",
                checked: checked,
                onChange: (e)=>onChange(e.target.checked),
                style: {
                    margin: 0
                }
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
                lineNumber: 833,
                columnNumber: 7
            }, this),
            label
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/components/product-modal/components/Tabs/tab-images.tsx",
        lineNumber: 832,
        columnNumber: 5
    }, this);
}
_c1 = Checkbox;
var _c, _c1;
__turbopack_context__.k.register(_c, "TabImages");
__turbopack_context__.k.register(_c1, "Checkbox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_components_product-modal_components_Tabs_tab-images_tsx_c6fa6078._.js.map