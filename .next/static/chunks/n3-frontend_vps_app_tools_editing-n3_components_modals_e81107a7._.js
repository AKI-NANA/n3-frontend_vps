(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx
/**
 * N3BulkImageUploadModal (最終修正版)
 * 
 * 機能:
 * - バケット不一致修正に対応
 * - 画像URL保存処理の重複を排除し、Hookに一本化
 * - リスト即時反映のためのステータス更新を追加
 */ __turbopack_context__.s([
    "N3BulkImageUploadModal",
    ()=>N3BulkImageUploadModal,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/folder-open.js [app-client] (ecmascript) <export default as FolderOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$archive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileArchive$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/file-archive.js [app-client] (ecmascript) <export default as FileArchive>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/camera.js [app-client] (ecmascript) <export default as Camera>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$inventory$2d$sync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-inventory-sync.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/supabase/client.ts [app-client] (ecmascript)"); // 直接DB操作用
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$jszip$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/jszip/lib/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function N3BulkImageUploadModal(param) {
    let { isOpen, onClose, onSuccess } = param;
    _s();
    const [uploadMode, setUploadMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('folder');
    const [files, setFiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [relativePaths, setRelativePaths] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [zipFile, setZipFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [skuPrefix, setSkuPrefix] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('PLUS1');
    const [storageLocation, setStorageLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('plus1');
    const [inventoryType, setInventoryType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('stock');
    const [uploading, setUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [progress, setProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        current: 0,
        total: 0,
        status: ''
    });
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [dragOver, setDragOver] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const folderInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const zipInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const inventorySync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$inventory$2d$sync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInventorySync"])();
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
    // --- ファイル選択ハンドラ ---
    const handleSingleFileChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3BulkImageUploadModal.useCallback[handleSingleFileChange]": (e)=>{
            if (e.target.files) {
                const newFiles = Array.from(e.target.files).filter({
                    "N3BulkImageUploadModal.useCallback[handleSingleFileChange].newFiles": (f)=>f.type.startsWith('image/')
                }["N3BulkImageUploadModal.useCallback[handleSingleFileChange].newFiles"]);
                setFiles({
                    "N3BulkImageUploadModal.useCallback[handleSingleFileChange]": (prev)=>[
                            ...prev,
                            ...newFiles
                        ]
                }["N3BulkImageUploadModal.useCallback[handleSingleFileChange]"]);
                setRelativePaths({
                    "N3BulkImageUploadModal.useCallback[handleSingleFileChange]": (prev)=>[
                            ...prev,
                            ...newFiles.map({
                                "N3BulkImageUploadModal.useCallback[handleSingleFileChange]": (f)=>f.name
                            }["N3BulkImageUploadModal.useCallback[handleSingleFileChange]"])
                        ]
                }["N3BulkImageUploadModal.useCallback[handleSingleFileChange]"]);
            }
        }
    }["N3BulkImageUploadModal.useCallback[handleSingleFileChange]"], []);
    const handleFolderChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3BulkImageUploadModal.useCallback[handleFolderChange]": (e)=>{
            if (e.target.files) {
                const newFiles = Array.from(e.target.files).filter({
                    "N3BulkImageUploadModal.useCallback[handleFolderChange].newFiles": (f)=>f.type.startsWith('image/')
                }["N3BulkImageUploadModal.useCallback[handleFolderChange].newFiles"]);
                const paths = newFiles.map({
                    "N3BulkImageUploadModal.useCallback[handleFolderChange].paths": (f)=>f.webkitRelativePath || f.name
                }["N3BulkImageUploadModal.useCallback[handleFolderChange].paths"]);
                setFiles(newFiles);
                setRelativePaths(paths);
                setZipFile(null);
            }
        }
    }["N3BulkImageUploadModal.useCallback[handleFolderChange]"], []);
    const handleZipChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3BulkImageUploadModal.useCallback[handleZipChange]": (e)=>{
            if (e.target.files && e.target.files[0]) {
                setZipFile(e.target.files[0]);
                setFiles([]);
                setRelativePaths([]);
            }
        }
    }["N3BulkImageUploadModal.useCallback[handleZipChange]"], []);
    const handleDrop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3BulkImageUploadModal.useCallback[handleDrop]": (e)=>{
            e.preventDefault();
            setDragOver(false);
            const items = e.dataTransfer.items;
            if (!items) return;
            const droppedFiles = Array.from(e.dataTransfer.files);
            const zip = droppedFiles.find({
                "N3BulkImageUploadModal.useCallback[handleDrop].zip": (f)=>f.name.endsWith('.zip')
            }["N3BulkImageUploadModal.useCallback[handleDrop].zip"]);
            if (zip) {
                setUploadMode('zip');
                setZipFile(zip);
                setFiles([]);
                setRelativePaths([]);
            } else {
                const imageFiles = droppedFiles.filter({
                    "N3BulkImageUploadModal.useCallback[handleDrop].imageFiles": (f)=>f.type.startsWith('image/')
                }["N3BulkImageUploadModal.useCallback[handleDrop].imageFiles"]);
                if (imageFiles.length > 0) {
                    if (uploadMode === 'zip') setUploadMode('single');
                    setFiles({
                        "N3BulkImageUploadModal.useCallback[handleDrop]": (prev)=>[
                                ...prev,
                                ...imageFiles
                            ]
                    }["N3BulkImageUploadModal.useCallback[handleDrop]"]);
                    setRelativePaths({
                        "N3BulkImageUploadModal.useCallback[handleDrop]": (prev)=>[
                                ...prev,
                                ...imageFiles.map({
                                    "N3BulkImageUploadModal.useCallback[handleDrop]": (f)=>f.name
                                }["N3BulkImageUploadModal.useCallback[handleDrop]"])
                            ]
                    }["N3BulkImageUploadModal.useCallback[handleDrop]"]);
                }
            }
        }
    }["N3BulkImageUploadModal.useCallback[handleDrop]"], [
        uploadMode
    ]);
    const clearAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3BulkImageUploadModal.useCallback[clearAll]": ()=>{
            setFiles([]);
            setRelativePaths([]);
            setZipFile(null);
            setResults(null);
            setProgress({
                current: 0,
                total: 0,
                status: ''
            });
        }
    }["N3BulkImageUploadModal.useCallback[clearAll]"], []);
    // --- プレビュー生成 ---
    const previewData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "N3BulkImageUploadModal.useMemo[previewData]": ()=>{
            if (uploadMode === 'zip' && zipFile) {
                return [
                    {
                        name: zipFile.name,
                        count: '解析待ち',
                        isZip: true
                    }
                ];
            }
            const folders = new Map();
            files.forEach({
                "N3BulkImageUploadModal.useMemo[previewData]": (file, i)=>{
                    const path = relativePaths[i] || file.name;
                    const parts = path.split('/').filter({
                        "N3BulkImageUploadModal.useMemo[previewData].parts": (p)=>p
                    }["N3BulkImageUploadModal.useMemo[previewData].parts"]);
                    let folderName = parts.length <= 1 ? "個別_".concat(file.name.replace(/\.[^/.]+$/, '')) : parts.length >= 2 ? parts[1] : parts[0];
                    if (!folderName.startsWith('.') && !folderName.startsWith('__')) {
                        folders.set(folderName, (folders.get(folderName) || 0) + 1);
                    }
                }
            }["N3BulkImageUploadModal.useMemo[previewData]"]);
            return Array.from(folders.entries()).map({
                "N3BulkImageUploadModal.useMemo[previewData]": (param)=>{
                    let [name, count] = param;
                    return {
                        name,
                        count,
                        isZip: false
                    };
                }
            }["N3BulkImageUploadModal.useMemo[previewData]"]);
        }
    }["N3BulkImageUploadModal.useMemo[previewData]"], [
        files,
        relativePaths,
        zipFile,
        uploadMode
    ]);
    // ▼ アップロード実行メイン処理
    const handleUpload = async ()=>{
        if (files.length === 0 && !zipFile) {
            alert('ファイルを選択してください');
            return;
        }
        setUploading(true);
        setResults(null);
        setProgress({
            current: 0,
            total: 0,
            status: '準備中...'
        });
        const processedGroups = [];
        const currentResults = {
            success: true,
            registered: 0,
            failed: 0,
            totalImages: 0,
            products: [],
            errors: []
        };
        try {
            // 1. ファイルの準備（ZIP解凍 または フォルダグループ化）
            if (zipFile) {
                setProgress({
                    current: 0,
                    total: 0,
                    status: 'ZIPファイルを解凍中...'
                });
                const zip = new __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$jszip$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]();
                const content = await zip.loadAsync(zipFile);
                const fileMap = new Map();
                for (const [relativePath, fileEntry] of Object.entries(content.files)){
                    var _fileEntry_name_split_pop;
                    if (fileEntry.dir || fileEntry.name.startsWith('__') || fileEntry.name.includes('/.')) continue;
                    const ext = (_fileEntry_name_split_pop = fileEntry.name.split('.').pop()) === null || _fileEntry_name_split_pop === void 0 ? void 0 : _fileEntry_name_split_pop.toLowerCase();
                    if (!ext || ![
                        'jpg',
                        'jpeg',
                        'png',
                        'webp',
                        'gif'
                    ].includes(ext)) continue;
                    const parts = relativePath.split('/').filter((p)=>p);
                    let folderName = parts.length <= 1 ? "個別_".concat(fileEntry.name.replace(/\.[^/.]+$/, '')) : parts.length >= 2 ? parts[1] : parts[0];
                    const blob = await fileEntry.async('blob');
                    const file = new File([
                        blob
                    ], fileEntry.name.split('/').pop() || 'image.jpg', {
                        type: "image/".concat(ext === 'jpg' ? 'jpeg' : ext)
                    });
                    if (!fileMap.has(folderName)) fileMap.set(folderName, []);
                    fileMap.get(folderName).push(file);
                }
                fileMap.forEach((files, folderName)=>processedGroups.push({
                        folderName,
                        files
                    }));
            } else {
                const fileMap = new Map();
                files.forEach((file, i)=>{
                    const path = relativePaths[i] || file.name;
                    const parts = path.split('/').filter((p)=>p);
                    let folderName = parts.length <= 1 ? "個別_".concat(file.name.replace(/\.[^/.]+$/, '')) : parts.length >= 2 ? parts[1] : parts[0];
                    if (!folderName.startsWith('.') && !folderName.startsWith('__')) {
                        if (!fileMap.has(folderName)) fileMap.set(folderName, []);
                        fileMap.get(folderName).push(file);
                    }
                });
                fileMap.forEach((files, folderName)=>processedGroups.push({
                        folderName,
                        files
                    }));
            }
            const totalGroups = processedGroups.length;
            setProgress({
                current: 0,
                total: totalGroups,
                status: '登録開始...'
            });
            // 2. 登録ループ (直列実行)
            for(let i = 0; i < totalGroups; i++){
                const group = processedGroups[i];
                const productName = group.folderName.replace(/^個別_/, '').replace(/_/g, ' ');
                setProgress({
                    current: i + 1,
                    total: totalGroups,
                    status: "登録中 (".concat(i + 1, "/").concat(totalGroups, "): ").concat(productName)
                });
                try {
                    // A. 正規のSKU生成 (useInventorySync.generateSku)
                    const sku = await inventorySync.generateSku(skuPrefix);
                    console.log("[Upload] Processing: ".concat(productName, " (SKU: ").concat(sku, ")"));
                    // B. 商品登録 (createProduct)
                    const createRes = await inventorySync.createProduct({
                        product_name: productName,
                        sku: sku,
                        physical_quantity: 1,
                        cost_price: 0,
                        selling_price: 0,
                        condition_name: 'New',
                        storage_location: storageLocation,
                        inventory_type: inventoryType,
                        product_type: 'single',
                        source_type: 'bulk_upload_client',
                        images: [] // 画像は後で更新
                    });
                    if (!createRes.success || !createRes.product) {
                        throw new Error(createRes.error || '商品登録失敗');
                    }
                    const newProduct = createRes.product;
                    const uploadedImages = [];
                    // C. 画像アップロード
                    for (const file of group.files){
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('inventory_master_id', String(newProduct.id));
                        const uploadRes = await fetch('/api/inventory/upload-image', {
                            method: 'POST',
                            body: formData
                        });
                        if (uploadRes.ok) {
                            const data = await uploadRes.json();
                            const imageUrl = data.url || data.data && data.data.url || null;
                            if (imageUrl) {
                                uploadedImages.push(imageUrl);
                                console.log("  ✅ Uploaded: ".concat(imageUrl));
                            }
                        } else {
                            console.warn("  ⚠️ Upload failed: ".concat(uploadRes.status));
                        }
                    }
                    // D. DB更新 (画像URL & マーケットプレイス情報)
                    if (uploadedImages.length > 0) {
                        console.log("[Upload] Saving ".concat(uploadedImages.length, " images to DB for ").concat(sku));
                        // 1. 画像URLの保存 (useInventorySyncのHookを使用)
                        // これにより images(jsonb) と inventory_images(text[]) が正しく保存されます
                        const updateRes = await inventorySync.updateProductImages(String(newProduct.id), uploadedImages);
                        if (!updateRes.success) {
                            console.error("  ❌ DB Image Update failed:", updateRes.error);
                        }
                        // 2. ステータス等の追加情報更新 (直接Supabase)
                        // ※ここで images/inventory_images を上書きしないように注意
                        const { error: statusUpdateError } = await supabase.from('inventory_master').update({
                            marketplace: 'ebay',
                            source_data: {
                                ...newProduct.source_data,
                                listing_status: 'active',
                                imported_at: new Date().toISOString(),
                                source_type: 'bulk_upload_zip'
                            }
                        }).eq('id', newProduct.id);
                        if (statusUpdateError) {
                            console.warn("  ⚠️ Status update warning:", statusUpdateError.message);
                        }
                    }
                    currentResults.registered++;
                    currentResults.totalImages += uploadedImages.length;
                    currentResults.products.push({
                        id: newProduct.id,
                        sku: newProduct.sku,
                        productName: newProduct.product_name,
                        imageCount: uploadedImages.length
                    });
                } catch (err) {
                    console.error("[Upload] Error processing ".concat(group.folderName, ":"), err);
                    currentResults.failed++;
                    currentResults.errors.push({
                        folderName: group.folderName,
                        error: err.message
                    });
                }
            }
            setResults(currentResults);
            if (currentResults.failed === 0) {
                onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
            }
        } catch (error) {
            console.error('Bulk upload fatal error:', error);
            setResults({
                ...currentResults,
                success: false,
                errors: [
                    ...currentResults.errors,
                    {
                        folderName: 'System',
                        error: error.message
                    }
                ]
            });
        } finally{
            setUploading(false);
        }
    };
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[9999] flex items-center justify-center",
        style: {
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)'
        },
        onClick: (e)=>e.target === e.currentTarget && !uploading && onClose(),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg shadow-2xl",
            style: {
                background: 'var(--panel)'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between px-6 py-4",
                    style: {
                        background: 'var(--accent)',
                        color: 'white'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                    size: 24
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                    lineNumber: 353,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-lg font-bold",
                                            children: "画像一括登録 (Storage修正版)"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                            lineNumber: 355,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm opacity-80",
                                            children: "ZIP解凍・正規SKU・DB完全同期"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                            lineNumber: 356,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                    lineNumber: 354,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                            lineNumber: 352,
                            columnNumber: 11
                        }, this),
                        !uploading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "p-2 rounded-full hover:bg-white/20",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                lineNumber: 359,
                                columnNumber: 99
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                            lineNumber: 359,
                            columnNumber: 26
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                    lineNumber: 351,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 overflow-y-auto",
                    style: {
                        maxHeight: 'calc(90vh - 80px)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2 mb-6",
                            children: [
                                {
                                    mode: 'folder',
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__["FolderOpen"],
                                    label: 'フォルダ',
                                    desc: 'サブフォルダ = 1商品'
                                },
                                {
                                    mode: 'zip',
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$archive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileArchive$3e$__["FileArchive"],
                                    label: 'ZIP一括',
                                    desc: 'ZIPを解凍して登録'
                                },
                                {
                                    mode: 'single',
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__["Camera"],
                                    label: '個別',
                                    desc: '1画像 = 1商品'
                                }
                            ].map((param)=>{
                                let { mode, icon: Icon, label, desc } = param;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        if (!uploading) {
                                            setUploadMode(mode);
                                            clearAll();
                                        }
                                    },
                                    disabled: uploading,
                                    className: "flex-1 p-4 rounded-lg border-2 transition-all ".concat(uploadMode === mode ? 'border-blue-500 bg-blue-50' : 'border-gray-200'),
                                    style: {
                                        background: uploadMode === mode ? 'rgba(59, 130, 246, 0.1)' : 'var(--highlight)',
                                        opacity: uploading ? 0.5 : 1
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                            size: 24,
                                            className: "mx-auto mb-2 ".concat(uploadMode === mode ? 'text-blue-500' : 'text-gray-400')
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                            lineNumber: 376,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm font-semibold",
                                            children: label
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                            lineNumber: 377,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs text-gray-500",
                                            children: desc
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                            lineNumber: 378,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, mode, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                    lineNumber: 369,
                                    columnNumber: 15
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                            lineNumber: 363,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-3 gap-4 mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-semibold mb-1 text-gray-500",
                                            children: "SKUプレフィックス"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                            lineNumber: 385,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: skuPrefix,
                                            onChange: (e)=>setSkuPrefix(e.target.value.toUpperCase()),
                                            disabled: uploading,
                                            className: "w-full h-9 px-3 rounded text-sm border"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                            lineNumber: 386,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                    lineNumber: 384,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-semibold mb-1 text-gray-500",
                                            children: "保管場所"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                            lineNumber: 389,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: storageLocation,
                                            onChange: (e)=>setStorageLocation(e.target.value),
                                            disabled: uploading,
                                            className: "w-full h-9 px-3 rounded text-sm border",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "plus1",
                                                    children: "Plus1"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                                    lineNumber: 391,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "env",
                                                    children: "ENV"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                                    lineNumber: 392,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "yao",
                                                    children: "八尾"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                                    lineNumber: 393,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                            lineNumber: 390,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                    lineNumber: 388,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-xs font-semibold mb-1 text-gray-500",
                                            children: "在庫タイプ"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                            lineNumber: 397,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: inventoryType,
                                            onChange: (e)=>setInventoryType(e.target.value),
                                            disabled: uploading,
                                            className: "w-full h-9 px-3 rounded text-sm border",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "stock",
                                                    children: "有在庫 (stock)"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                                    lineNumber: 399,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "mu",
                                                    children: "無在庫 (mu)"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                                    lineNumber: 400,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                            lineNumber: 398,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                    lineNumber: 396,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                            lineNumber: 383,
                            columnNumber: 11
                        }, this),
                        !uploading && !results && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative border-2 border-dashed rounded-lg p-8 text-center mb-6 cursor-pointer ".concat(dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'),
                            onDrop: handleDrop,
                            onDragOver: (e)=>{
                                e.preventDefault();
                                setDragOver(true);
                            },
                            onDragLeave: (e)=>{
                                e.preventDefault();
                                setDragOver(false);
                            },
                            onClick: ()=>{
                                var _folderInputRef_current, _zipInputRef_current, _fileInputRef_current;
                                if (uploadMode === 'folder') (_folderInputRef_current = folderInputRef.current) === null || _folderInputRef_current === void 0 ? void 0 : _folderInputRef_current.click();
                                else if (uploadMode === 'zip') (_zipInputRef_current = zipInputRef.current) === null || _zipInputRef_current === void 0 ? void 0 : _zipInputRef_current.click();
                                else (_fileInputRef_current = fileInputRef.current) === null || _fileInputRef_current === void 0 ? void 0 : _fileInputRef_current.click();
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "file",
                                    ref: fileInputRef,
                                    multiple: true,
                                    accept: "image/*",
                                    onChange: handleSingleFileChange,
                                    className: "hidden"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                    lineNumber: 417,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "file",
                                    ref: folderInputRef,
                                    webkitdirectory: '',
                                    directory: '',
                                    onChange: handleFolderChange,
                                    className: "hidden"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                    lineNumber: 418,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "file",
                                    ref: zipInputRef,
                                    accept: ".zip",
                                    onChange: handleZipChange,
                                    className: "hidden"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                    lineNumber: 419,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                    size: 48,
                                    className: "mx-auto mb-4 text-gray-400"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                    lineNumber: 420,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-base font-medium text-gray-700",
                                    children: uploadMode === 'zip' ? 'ZIPファイルを選択' : '画像ファイル/フォルダを選択'
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                    lineNumber: 421,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                            lineNumber: 406,
                            columnNumber: 13
                        }, this),
                        uploading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6 p-6 rounded-lg bg-blue-50 border border-blue-100",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between text-sm mb-2 text-blue-800 font-medium",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: progress.status
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                            lineNumber: 428,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                Math.round(progress.current / progress.total * 100),
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                            lineNumber: 429,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                    lineNumber: 427,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-full bg-blue-200 rounded-full h-2.5",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-blue-600 h-2.5 rounded-full transition-all duration-300",
                                        style: {
                                            width: "".concat(progress.current / progress.total * 100, "%")
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                        lineNumber: 432,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                    lineNumber: 431,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-2 text-xs text-blue-500 text-center flex items-center justify-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                            size: 12,
                                            className: "animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                            lineNumber: 435,
                                            columnNumber: 17
                                        }, this),
                                        " 処理中はブラウザを閉じないでください"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                    lineNumber: 434,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                            lineNumber: 426,
                            columnNumber: 13
                        }, this),
                        !uploading && !results && previewData.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-sm font-semibold",
                                            children: [
                                                "検出された商品 (",
                                                previewData.length,
                                                "件)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                            lineNumber: 443,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: clearAll,
                                            className: "text-xs text-red-500",
                                            children: "すべてクリア"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                            lineNumber: 444,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                    lineNumber: 442,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-lg",
                                    children: previewData.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 p-2 bg-white rounded border",
                                            children: [
                                                item.isZip ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$archive$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileArchive$3e$__["FileArchive"], {
                                                    size: 16,
                                                    className: "text-orange-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                                    lineNumber: 449,
                                                    columnNumber: 35
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderOpen$3e$__["FolderOpen"], {
                                                    size: 16,
                                                    className: "text-blue-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                                    lineNumber: 449,
                                                    columnNumber: 91
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-sm truncate flex-1",
                                                    children: item.name
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                                    lineNumber: 450,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs bg-blue-100 text-blue-800 px-2 rounded",
                                                    children: item.count
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                                    lineNumber: 451,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, i, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                            lineNumber: 448,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                    lineNumber: 446,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                            lineNumber: 441,
                            columnNumber: 13
                        }, this),
                        !uploading && !results && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                            onClick: handleUpload,
                            disabled: files.length === 0 && !zipFile,
                            variant: "primary",
                            size: "lg",
                            style: {
                                width: '100%'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                    lineNumber: 460,
                                    columnNumber: 15
                                }, this),
                                " 登録実行"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                            lineNumber: 459,
                            columnNumber: 13
                        }, this),
                        results && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6 p-4 rounded-lg",
                            style: {
                                background: results.failed === 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 mb-4 font-bold text-gray-800",
                                    children: [
                                        results.failed === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                            size: 20,
                                            className: "text-green-500"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                            lineNumber: 467,
                                            columnNumber: 41
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                            size: 20,
                                            className: "text-orange-500"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                            lineNumber: 467,
                                            columnNumber: 96
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                "登録完了: ",
                                                results.registered,
                                                "件 / 失敗: ",
                                                results.failed,
                                                "件"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                            lineNumber: 468,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                    lineNumber: 466,
                                    columnNumber: 15
                                }, this),
                                results.errors.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 p-3 bg-white rounded border border-red-200 max-h-40 overflow-y-auto",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            className: "text-sm font-semibold mb-2 text-red-600",
                                            children: "エラー詳細:"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                            lineNumber: 473,
                                            columnNumber: 19
                                        }, this),
                                        results.errors.map((err, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-red-500 mb-1",
                                                children: [
                                                    "• ",
                                                    err.folderName,
                                                    ": ",
                                                    err.error
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                                lineNumber: 475,
                                                columnNumber: 21
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                    lineNumber: 472,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 flex justify-end",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                        onClick: clearAll,
                                        variant: "secondary",
                                        size: "sm",
                                        children: "閉じる"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                        lineNumber: 481,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                                    lineNumber: 480,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                            lineNumber: 465,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
                    lineNumber: 362,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
            lineNumber: 347,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx",
        lineNumber: 342,
        columnNumber: 5
    }, this);
}
_s(N3BulkImageUploadModal, "C8T28EJUDNvb1yM8mW2+1zy8wS8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$inventory$2d$sync$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInventorySync"]
    ];
});
_c = N3BulkImageUploadModal;
const __TURBOPACK__default__export__ = N3BulkImageUploadModal;
var _c;
__turbopack_context__.k.register(_c, "N3BulkImageUploadModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx
/**
 * N3ImageAttachModal - 既存商品への画像紐付けモーダル
 * 
 * 機能:
 * - 画像なし商品のリスト表示
 * - 各商品に画像をドラッグ&ドロップで追加
 * - SKU/商品名でマッチングして一括紐付け
 */ __turbopack_context__.s([
    "N3ImageAttachModal",
    ()=>N3ImageAttachModal,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/camera.js [app-client] (ecmascript) <export default as Camera>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/supabase/client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function N3ImageAttachModal(param) {
    let { isOpen, onClose, onSuccess } = param;
    _s();
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedProduct, setSelectedProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [uploading, setUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [uploadProgress, setUploadProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [pendingImages, setPendingImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [page, setPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [totalCount, setTotalCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const pageSize = 20;
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
    // 画像なし商品を取得
    const loadProductsWithoutImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3ImageAttachModal.useCallback[loadProductsWithoutImages]": async ()=>{
            setLoading(true);
            try {
                // 画像がない商品を取得（images が null または空配列）
                let query = supabase.from('inventory_master').select('id, sku, product_name, physical_quantity, storage_location, created_at, images', {
                    count: 'exact'
                }).or('images.is.null,images.eq.[]').order('created_at', {
                    ascending: false
                });
                if (searchQuery) {
                    query = query.or("sku.ilike.%".concat(searchQuery, "%,product_name.ilike.%").concat(searchQuery, "%"));
                }
                const { data, error, count } = await query.range((page - 1) * pageSize, page * pageSize - 1);
                if (error) throw error;
                setProducts(data || []);
                setTotalCount(count || 0);
            } catch (err) {
                console.error('Load products error:', err);
            } finally{
                setLoading(false);
            }
        }
    }["N3ImageAttachModal.useCallback[loadProductsWithoutImages]"], [
        searchQuery,
        page,
        supabase
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3ImageAttachModal.useEffect": ()=>{
            if (isOpen) {
                loadProductsWithoutImages();
            }
        }
    }["N3ImageAttachModal.useEffect"], [
        isOpen,
        loadProductsWithoutImages
    ]);
    // 画像選択ハンドラ
    const handleFileSelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3ImageAttachModal.useCallback[handleFileSelect]": (productId, files)=>{
            if (!files) return;
            const imageFiles = Array.from(files).filter({
                "N3ImageAttachModal.useCallback[handleFileSelect].imageFiles": (f)=>f.type.startsWith('image/')
            }["N3ImageAttachModal.useCallback[handleFileSelect].imageFiles"]);
            if (imageFiles.length === 0) return;
            setPendingImages({
                "N3ImageAttachModal.useCallback[handleFileSelect]": (prev)=>({
                        ...prev,
                        [productId]: [
                            ...prev[productId] || [],
                            ...imageFiles
                        ]
                    })
            }["N3ImageAttachModal.useCallback[handleFileSelect]"]);
        }
    }["N3ImageAttachModal.useCallback[handleFileSelect]"], []);
    // 画像削除
    const removePendingImage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3ImageAttachModal.useCallback[removePendingImage]": (productId, index)=>{
            setPendingImages({
                "N3ImageAttachModal.useCallback[removePendingImage]": (prev)=>{
                    var _prev_productId;
                    return {
                        ...prev,
                        [productId]: ((_prev_productId = prev[productId]) === null || _prev_productId === void 0 ? void 0 : _prev_productId.filter({
                            "N3ImageAttachModal.useCallback[removePendingImage]": (_, i)=>i !== index
                        }["N3ImageAttachModal.useCallback[removePendingImage]"])) || []
                    };
                }
            }["N3ImageAttachModal.useCallback[removePendingImage]"]);
        }
    }["N3ImageAttachModal.useCallback[removePendingImage]"], []);
    // 単一商品への画像アップロード
    const uploadImagesForProduct = async (productId, files)=>{
        const uploadedUrls = [];
        for (const file of files){
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('inventory_master_id', productId);
                const res = await fetch('/api/inventory/upload-image', {
                    method: 'POST',
                    body: formData
                });
                if (res.ok) {
                    var _data_data;
                    const data = await res.json();
                    const imageUrl = data.url || ((_data_data = data.data) === null || _data_data === void 0 ? void 0 : _data_data.url);
                    if (imageUrl) {
                        uploadedUrls.push(imageUrl);
                    }
                }
            } catch (err) {
                console.error('Upload error:', err);
            }
        }
        if (uploadedUrls.length > 0) {
            // DBの images カラムを更新
            const { error } = await supabase.from('inventory_master').update({
                images: uploadedUrls,
                image_url: uploadedUrls[0],
                updated_at: new Date().toISOString()
            }).eq('id', productId);
            return !error;
        }
        return false;
    };
    // 全ての保留中画像をアップロード
    const handleUploadAll = async ()=>{
        const productIds = Object.keys(pendingImages).filter((id)=>{
            var _pendingImages_id;
            return ((_pendingImages_id = pendingImages[id]) === null || _pendingImages_id === void 0 ? void 0 : _pendingImages_id.length) > 0;
        });
        if (productIds.length === 0) return;
        setUploading(true);
        for (const productId of productIds){
            setUploadProgress((prev)=>({
                    ...prev,
                    [productId]: 'uploading'
                }));
            const success = await uploadImagesForProduct(productId, pendingImages[productId]);
            setUploadProgress((prev)=>({
                    ...prev,
                    [productId]: success ? 'done' : 'error'
                }));
        }
        setUploading(false);
        // 成功した商品を pendingImages から削除
        setPendingImages((prev)=>{
            const newPending = {
                ...prev
            };
            for (const productId of productIds){
                if (uploadProgress[productId] === 'done') {
                    delete newPending[productId];
                }
            }
            return newPending;
        });
        // リストを更新
        loadProductsWithoutImages();
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
    };
    // ドラッグ&ドロップ
    const handleDrop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3ImageAttachModal.useCallback[handleDrop]": (e, productId)=>{
            e.preventDefault();
            e.stopPropagation();
            handleFileSelect(productId, e.dataTransfer.files);
        }
    }["N3ImageAttachModal.useCallback[handleDrop]"], [
        handleFileSelect
    ]);
    const totalPages = Math.ceil(totalCount / pageSize);
    const pendingCount = Object.values(pendingImages).reduce((sum, files)=>sum + files.length, 0);
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[9999] flex items-center justify-center",
        style: {
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)'
        },
        onClick: (e)=>e.target === e.currentTarget && !uploading && onClose(),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-lg shadow-2xl",
            style: {
                background: 'var(--panel)'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between px-6 py-4",
                    style: {
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: 'white'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                    size: 24
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                    lineNumber: 220,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-lg font-bold",
                                            children: "画像なし商品への画像追加"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                            lineNumber: 222,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm opacity-80",
                                            children: [
                                                totalCount,
                                                "件の画像なし商品",
                                                pendingCount > 0 && " • ".concat(pendingCount, "枚の画像を待機中")
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                            lineNumber: 223,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                    lineNumber: 221,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                            lineNumber: 219,
                            columnNumber: 11
                        }, this),
                        !uploading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "p-2 rounded-full hover:bg-white/20",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                lineNumber: 231,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                            lineNumber: 230,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                    lineNumber: 215,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-6 py-3 border-b",
                    style: {
                        borderColor: 'var(--panel-border)'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        size: 16,
                                        className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                        lineNumber: 240,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: searchQuery,
                                        onChange: (e)=>{
                                            setSearchQuery(e.target.value);
                                            setPage(1);
                                        },
                                        placeholder: "SKU または 商品名で検索...",
                                        className: "w-full pl-10 pr-4 py-2 rounded-lg border text-sm",
                                        style: {
                                            borderColor: 'var(--panel-border)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                        lineNumber: 241,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                lineNumber: 239,
                                columnNumber: 13
                            }, this),
                            pendingCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                onClick: handleUploadAll,
                                disabled: uploading,
                                variant: "primary",
                                size: "sm",
                                children: uploading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                            size: 14,
                                            className: "animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                            lineNumber: 260,
                                            columnNumber: 21
                                        }, this),
                                        "アップロード中..."
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                            lineNumber: 265,
                                            columnNumber: 21
                                        }, this),
                                        pendingCount,
                                        "枚をアップロード"
                                    ]
                                }, void 0, true)
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                lineNumber: 252,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                        lineNumber: 238,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                    lineNumber: 237,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 overflow-y-auto",
                    style: {
                        maxHeight: 'calc(90vh - 200px)'
                    },
                    children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center py-12",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                            size: 32,
                            className: "animate-spin text-gray-400"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                            lineNumber: 278,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                        lineNumber: 277,
                        columnNumber: 13
                    }, this) : products.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-12",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                size: 48,
                                className: "mx-auto mb-4 text-green-500"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                lineNumber: 282,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-lg font-semibold text-gray-700",
                                children: "すべての商品に画像があります"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                lineNumber: 283,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-500 mt-2",
                                children: "画像なしの商品はありません"
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                lineNumber: 286,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                        lineNumber: 281,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: products.map((product)=>{
                            const pending = pendingImages[product.id] || [];
                            const status = uploadProgress[product.id];
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4 p-4 rounded-lg border transition-all",
                                style: {
                                    borderColor: pending.length > 0 ? '#f59e0b' : 'var(--panel-border)',
                                    background: status === 'done' ? 'rgba(34, 197, 94, 0.1)' : 'var(--highlight)'
                                },
                                onDragOver: (e)=>{
                                    e.preventDefault();
                                    e.stopPropagation();
                                },
                                onDrop: (e)=>handleDrop(e, product.id),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center",
                                        children: pending.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative w-full h-full",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: URL.createObjectURL(pending[0]),
                                                    alt: "",
                                                    className: "w-full h-full object-cover rounded-lg"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                                    lineNumber: 311,
                                                    columnNumber: 27
                                                }, this),
                                                pending.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute bottom-0 right-0 px-1.5 py-0.5 bg-black/70 text-white text-[10px] font-bold rounded-tl",
                                                    children: [
                                                        "+",
                                                        pending.length - 1
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                            lineNumber: 310,
                                            columnNumber: 25
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                            size: 24,
                                            className: "text-gray-300"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                            lineNumber: 323,
                                            columnNumber: 25
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                        lineNumber: 308,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 mb-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-mono px-2 py-0.5 bg-gray-100 rounded",
                                                        children: product.sku
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                                        lineNumber: 329,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-gray-500",
                                                        children: [
                                                            "在庫: ",
                                                            product.physical_quantity
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                                        lineNumber: 332,
                                                        columnNumber: 25
                                                    }, this),
                                                    product.storage_location && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded",
                                                        children: product.storage_location
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                                        lineNumber: 336,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                                lineNumber: 328,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium truncate",
                                                children: product.product_name || '（商品名なし）'
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                                lineNumber: 341,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                        lineNumber: 327,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            pending.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1",
                                                children: pending.slice(0, 3).map((file, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative group",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: URL.createObjectURL(file),
                                                                alt: "",
                                                                className: "w-10 h-10 object-cover rounded border"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                                                lineNumber: 353,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>removePendingImage(product.id, idx),
                                                                className: "absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                                    size: 10
                                                                }, void 0, false, {
                                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                                                    lineNumber: 362,
                                                                    columnNumber: 33
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                                                lineNumber: 358,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, idx, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                                        lineNumber: 352,
                                                        columnNumber: 29
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                                lineNumber: 350,
                                                columnNumber: 25
                                            }, this),
                                            status === 'uploading' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                size: 20,
                                                className: "animate-spin text-blue-500"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                                lineNumber: 371,
                                                columnNumber: 25
                                            }, this),
                                            status === 'done' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                size: 20,
                                                className: "text-green-500"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                                lineNumber: 374,
                                                columnNumber: 25
                                            }, this),
                                            status === 'error' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                size: 20,
                                                className: "text-red-500"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                                lineNumber: 377,
                                                columnNumber: 25
                                            }, this),
                                            status !== 'done' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "file",
                                                        accept: "image/*",
                                                        multiple: true,
                                                        onChange: (e)=>handleFileSelect(product.id, e.target.files),
                                                        className: "hidden",
                                                        id: "file-input-".concat(product.id)
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                                        lineNumber: 383,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        htmlFor: "file-input-".concat(product.id),
                                                        className: "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors",
                                                        style: {
                                                            background: pending.length > 0 ? '#fef3c7' : 'var(--panel)',
                                                            border: '1px dashed',
                                                            borderColor: pending.length > 0 ? '#f59e0b' : '#d1d5db'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__["Camera"], {
                                                                size: 16,
                                                                className: pending.length > 0 ? 'text-orange-500' : 'text-gray-400'
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                                                lineNumber: 400,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs font-medium",
                                                                children: pending.length > 0 ? '追加' : '画像選択'
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                                                lineNumber: 401,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                                        lineNumber: 391,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                        lineNumber: 347,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, product.id, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                lineNumber: 297,
                                columnNumber: 19
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                        lineNumber: 291,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                    lineNumber: 275,
                    columnNumber: 9
                }, this),
                totalPages > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center gap-4 px-6 py-3 border-t",
                    style: {
                        borderColor: 'var(--panel-border)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setPage((p)=>Math.max(1, p - 1)),
                            disabled: page <= 1,
                            className: "p-2 rounded hover:bg-gray-100 disabled:opacity-30",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                lineNumber: 423,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                            lineNumber: 418,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm text-gray-600",
                            children: [
                                page,
                                " / ",
                                totalPages
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                            lineNumber: 425,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setPage((p)=>Math.min(totalPages, p + 1)),
                            disabled: page >= totalPages,
                            className: "p-2 rounded hover:bg-gray-100 disabled:opacity-30",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                                lineNumber: 433,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                            lineNumber: 428,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                    lineNumber: 417,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-6 py-3 bg-gray-50 border-t text-xs text-gray-500",
                    style: {
                        borderColor: 'var(--panel-border)'
                    },
                    children: "💡 ヒント: 商品行に画像をドラッグ&ドロップすることもできます。複数枚の画像を選択可能です。"
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
                    lineNumber: 439,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
            lineNumber: 210,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx",
        lineNumber: 205,
        columnNumber: 5
    }, this);
}
_s(N3ImageAttachModal, "dc6+nCGedth6yoNTiCWwwh9QYn4=");
_c = N3ImageAttachModal;
const __TURBOPACK__default__export__ = N3ImageAttachModal;
var _c;
__turbopack_context__.k.register(_c, "N3ImageAttachModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx
/**
 * 棚卸し商品詳細モーダル
 * 
 * inventory_master の商品詳細を表示・編集するモーダル
 * 原価と在庫数のインライン編集に対応
 * L4属性（販売予定販路）とその他経費の編集に対応
 */ __turbopack_context__.s([
    "N3InventoryDetailModal",
    ()=>N3InventoryDetailModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-client] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/hash.js [app-client] (ecmascript) <export default as Hash>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/store.js [app-client] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-divider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$types$2f$inventory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/types/inventory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/lib/supabase/client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function N3InventoryDetailModal(param) {
    let { product, isOpen, onClose, onSave, onStockChange, onCostChange, onRefresh } = param;
    var _localProduct_images, _localProduct_ebay_account, _localProduct_ebay_account1, _localProduct_source_data;
    _s();
    const [localProduct, setLocalProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // 各フィールドの編集状態
    const [editingStock, setEditingStock] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingCost, setEditingCost] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 編集中の値
    const [stockValue, setStockValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [costValue, setCostValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // 保存中の状態
    const [savingStock, setSavingStock] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [savingCost, setSavingCost] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // L4属性（販売予定販路）
    const [selectedChannels, setSelectedChannels] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [savingChannels, setSavingChannels] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // その他経費
    const [costItems, setCostItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [savingCostItems, setSavingCostItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [newCostKey, setNewCostKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [newCostAmount, setNewCostAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // 商品データをローカルにコピー
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3InventoryDetailModal.useEffect": ()=>{
            if (product) {
                setLocalProduct({
                    ...product
                });
                setStockValue(String(product.physical_quantity || 0));
                setCostValue(String(product.cost_jpy || product.cost_price || 0));
                // L4属性を設定
                const l4 = product.attr_l4;
                setSelectedChannels(Array.isArray(l4) ? l4 : []);
                // その他経費を設定
                const additionalCosts = product.additional_costs || {};
                const items = [];
                for (const [key, amount] of Object.entries(additionalCosts)){
                    const preset = __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$types$2f$inventory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COST_ITEM_PRESETS"].find({
                        "N3InventoryDetailModal.useEffect.preset": (p)=>p.key === key
                    }["N3InventoryDetailModal.useEffect.preset"]);
                    items.push({
                        key,
                        label: (preset === null || preset === void 0 ? void 0 : preset.label) || key,
                        amount: Number(amount) || 0
                    });
                }
                setCostItems(items);
            }
        }
    }["N3InventoryDetailModal.useEffect"], [
        product
    ]);
    // モーダルが閉じられた時に編集状態をリセット
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3InventoryDetailModal.useEffect": ()=>{
            if (!isOpen) {
                setEditingStock(false);
                setEditingCost(false);
            }
        }
    }["N3InventoryDetailModal.useEffect"], [
        isOpen
    ]);
    if (!isOpen || !product || !localProduct) return null;
    // 在庫数の保存
    const handleSaveStock = async ()=>{
        if (!localProduct || !onStockChange) return;
        const newQuantity = parseInt(stockValue) || 0;
        if (newQuantity === localProduct.physical_quantity) {
            setEditingStock(false);
            return;
        }
        setSavingStock(true);
        try {
            await onStockChange(String(localProduct.id), newQuantity);
            setLocalProduct((prev)=>prev ? {
                    ...prev,
                    physical_quantity: newQuantity,
                    current_stock: newQuantity
                } : null);
            setEditingStock(false);
        } finally{
            setSavingStock(false);
        }
    };
    // 原価の保存
    const handleSaveCost = async ()=>{
        if (!localProduct || !onCostChange) return;
        const newCost = parseInt(costValue) || 0;
        const currentCost = localProduct.cost_jpy || localProduct.cost_price || 0;
        if (newCost === currentCost) {
            setEditingCost(false);
            return;
        }
        setSavingCost(true);
        try {
            await onCostChange(String(localProduct.id), newCost);
            setLocalProduct((prev)=>prev ? {
                    ...prev,
                    cost_price: newCost,
                    cost_jpy: newCost
                } : null);
            setEditingCost(false);
        } finally{
            setSavingCost(false);
        }
    };
    // L4属性（販売予定販路）の保存
    const handleSaveChannels = async ()=>{
        if (!localProduct) return;
        setSavingChannels(true);
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('inventory_master').update({
                attr_l4: selectedChannels
            }).eq('id', localProduct.id);
            if (error) throw error;
            setLocalProduct((prev)=>prev ? {
                    ...prev,
                    attr_l4: selectedChannels
                } : null);
            onRefresh === null || onRefresh === void 0 ? void 0 : onRefresh();
        } catch (err) {
            console.error('販路保存エラー:', err);
        } finally{
            setSavingChannels(false);
        }
    };
    // 販路チェックボックスのトグル
    const toggleChannel = (channel)=>{
        setSelectedChannels((prev)=>{
            if (prev.includes(channel)) {
                return prev.filter((c)=>c !== channel);
            } else {
                return [
                    ...prev,
                    channel
                ];
            }
        });
    };
    // その他経費の保存
    const handleSaveCostItems = async ()=>{
        if (!localProduct) return;
        setSavingCostItems(true);
        try {
            const additionalCosts = {};
            for (const item of costItems){
                if (item.amount > 0) {
                    additionalCosts[item.key] = item.amount;
                }
            }
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('inventory_master').update({
                additional_costs: additionalCosts
            }).eq('id', localProduct.id);
            if (error) throw error;
            setLocalProduct((prev)=>prev ? {
                    ...prev,
                    additional_costs: additionalCosts
                } : null);
            onRefresh === null || onRefresh === void 0 ? void 0 : onRefresh();
        } catch (err) {
            console.error('経費保存エラー:', err);
        } finally{
            setSavingCostItems(false);
        }
    };
    // 経費項目の追加
    const handleAddCostItem = ()=>{
        if (!newCostKey || !newCostAmount) return;
        const amount = parseInt(newCostAmount) || 0;
        if (amount <= 0) return;
        const preset = __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$types$2f$inventory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COST_ITEM_PRESETS"].find((p)=>p.key === newCostKey);
        const existingIndex = costItems.findIndex((item)=>item.key === newCostKey);
        if (existingIndex >= 0) {
            // 既存の項目を更新
            setCostItems((prev)=>prev.map((item, i)=>i === existingIndex ? {
                        ...item,
                        amount
                    } : item));
        } else {
            // 新規追加
            setCostItems((prev)=>[
                    ...prev,
                    {
                        key: newCostKey,
                        label: (preset === null || preset === void 0 ? void 0 : preset.label) || newCostKey,
                        amount
                    }
                ]);
        }
        setNewCostKey('');
        setNewCostAmount('');
    };
    // 経費項目の削除
    const handleRemoveCostItem = (key)=>{
        setCostItems((prev)=>prev.filter((item)=>item.key !== key));
    };
    // 経費合計
    const totalAdditionalCosts = costItems.reduce((sum, item)=>sum + item.amount, 0);
    // キー入力ハンドラ
    const handleKeyDown = (e, type)=>{
        if (e.key === 'Enter') {
            if (type === 'stock') handleSaveStock();
            else handleSaveCost();
        } else if (e.key === 'Escape') {
            if (type === 'stock') {
                setStockValue(String(localProduct.physical_quantity || 0));
                setEditingStock(false);
            } else {
                setCostValue(String(localProduct.cost_jpy || localProduct.cost_price || 0));
                setEditingCost(false);
            }
        }
    };
    // 画像URL
    const imageUrl = localProduct.image_url || ((_localProduct_images = localProduct.images) === null || _localProduct_images === void 0 ? void 0 : _localProduct_images[0]) || null;
    // 総原価（原価 + 経費）
    const baseCost = localProduct.cost_jpy || localProduct.cost_price || 0;
    const totalCost = baseCost + totalAdditionalCosts;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[9999] flex items-center justify-center",
        style: {
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)'
        },
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-lg shadow-xl",
            style: {
                background: 'var(--panel)'
            },
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between px-4 py-3 border-b",
                    style: {
                        borderColor: 'var(--panel-border)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                    size: 18,
                                    style: {
                                        color: 'var(--accent)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                    lineNumber: 292,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold",
                                    style: {
                                        color: 'var(--text)'
                                    },
                                    children: "商品詳細"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                    lineNumber: 293,
                                    columnNumber: 13
                                }, this),
                                localProduct.sku && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "px-2 py-0.5 rounded text-xs",
                                    style: {
                                        background: 'var(--highlight)',
                                        color: 'var(--text-muted)'
                                    },
                                    children: localProduct.sku
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                    lineNumber: 297,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                            lineNumber: 291,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "p-1.5 rounded hover:bg-[var(--highlight)]",
                            style: {
                                color: 'var(--text-muted)'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                lineNumber: 310,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                            lineNumber: 305,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                    lineNumber: 287,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "overflow-y-auto",
                    style: {
                        maxHeight: 'calc(90vh - 120px)'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-4 mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-32 h-32 rounded-lg overflow-hidden flex-shrink-0",
                                        style: {
                                            background: 'var(--highlight)'
                                        },
                                        children: imageUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: imageUrl,
                                            alt: localProduct.product_name || '',
                                            className: "w-full h-full object-cover"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                            lineNumber: 325,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-full h-full flex items-center justify-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                size: 32,
                                                style: {
                                                    color: 'var(--text-subtle)'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 332,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                            lineNumber: 331,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                        lineNumber: 320,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-medium mb-2 line-clamp-2",
                                                style: {
                                                    color: 'var(--text)'
                                                },
                                                children: localProduct.product_name || localProduct.title || '（商品名なし）'
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 339,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-2 text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'var(--text-muted)'
                                                                },
                                                                children: "SKU:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                lineNumber: 348,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2",
                                                                style: {
                                                                    color: 'var(--text)'
                                                                },
                                                                children: localProduct.sku || '-'
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                lineNumber: 349,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 347,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'var(--text-muted)'
                                                                },
                                                                children: "アカウント:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                lineNumber: 354,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2 px-1.5 py-0.5 rounded text-xs",
                                                                style: {
                                                                    background: ((_localProduct_ebay_account = localProduct.ebay_account) === null || _localProduct_ebay_account === void 0 ? void 0 : _localProduct_ebay_account.toLowerCase()) === 'mjt' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                                                    color: ((_localProduct_ebay_account1 = localProduct.ebay_account) === null || _localProduct_ebay_account1 === void 0 ? void 0 : _localProduct_ebay_account1.toLowerCase()) === 'mjt' ? 'rgb(59, 130, 246)' : 'rgb(34, 197, 94)'
                                                                },
                                                                children: localProduct.ebay_account || 'Manual'
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                lineNumber: 355,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 353,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'var(--text-muted)'
                                                                },
                                                                children: "商品タイプ:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                lineNumber: 370,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2",
                                                                style: {
                                                                    color: 'var(--text)'
                                                                },
                                                                children: localProduct.product_type === 'variation_parent' ? 'バリエーション親' : localProduct.product_type === 'variation_member' ? 'バリエーション子' : localProduct.product_type === 'set' ? 'セット商品' : '単品'
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                lineNumber: 371,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 369,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    color: 'var(--text-muted)'
                                                                },
                                                                children: "コンディション:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                lineNumber: 378,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2",
                                                                style: {
                                                                    color: 'var(--text)'
                                                                },
                                                                children: localProduct.condition_name || '-'
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                lineNumber: 379,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 377,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 346,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                        lineNumber: 338,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                lineNumber: 318,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {}, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                lineNumber: 387,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "py-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-sm font-semibold mb-3",
                                        style: {
                                            color: 'var(--text)'
                                        },
                                        children: [
                                            "在庫・価格 ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs font-normal",
                                                style: {
                                                    color: 'var(--text-muted)'
                                                },
                                                children: "（クリックで編集）"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 392,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                        lineNumber: 391,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-3 gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-3 rounded-lg cursor-pointer transition-all hover:ring-2 hover:ring-[var(--accent)]",
                                                style: {
                                                    background: 'var(--highlight)'
                                                },
                                                onClick: ()=>!editingStock && setEditingStock(true),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between mb-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$hash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Hash$3e$__["Hash"], {
                                                                        size: 14,
                                                                        style: {
                                                                            color: 'var(--text-muted)'
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                        lineNumber: 403,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs",
                                                                        style: {
                                                                            color: 'var(--text-muted)'
                                                                        },
                                                                        children: "在庫数"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                        lineNumber: 404,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                lineNumber: 402,
                                                                columnNumber: 21
                                                            }, this),
                                                            editingStock && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: (e)=>{
                                                                    e.stopPropagation();
                                                                    handleSaveStock();
                                                                },
                                                                disabled: savingStock,
                                                                className: "p-1 rounded hover:bg-[var(--panel)]",
                                                                style: {
                                                                    color: 'var(--color-success)'
                                                                },
                                                                children: savingStock ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                    size: 14,
                                                                    className: "animate-spin"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                    lineNumber: 413,
                                                                    columnNumber: 40
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                    size: 14
                                                                }, void 0, false, {
                                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                    lineNumber: 413,
                                                                    columnNumber: 89
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                lineNumber: 407,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 401,
                                                        columnNumber: 19
                                                    }, this),
                                                    editingStock ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: stockValue,
                                                        onChange: (e)=>setStockValue(e.target.value),
                                                        onKeyDown: (e)=>handleKeyDown(e, 'stock'),
                                                        onBlur: handleSaveStock,
                                                        autoFocus: true,
                                                        className: "w-full px-2 py-1 rounded text-xl font-bold text-center",
                                                        style: {
                                                            background: 'var(--panel)',
                                                            color: 'var(--text)',
                                                            border: '2px solid var(--accent)'
                                                        },
                                                        onClick: (e)=>e.stopPropagation()
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 418,
                                                        columnNumber: 21
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-2xl font-bold text-center",
                                                        style: {
                                                            color: (localProduct.physical_quantity || 0) > 0 ? 'var(--color-success)' : 'var(--color-error)'
                                                        },
                                                        children: localProduct.physical_quantity || 0
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 434,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 396,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-3 rounded-lg cursor-pointer transition-all hover:ring-2 hover:ring-[var(--accent)]",
                                                style: {
                                                    background: 'var(--highlight)'
                                                },
                                                onClick: ()=>!editingCost && setEditingCost(true),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between mb-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                                                        size: 14,
                                                                        style: {
                                                                            color: 'var(--text-muted)'
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                        lineNumber: 455,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs",
                                                                        style: {
                                                                            color: 'var(--text-muted)'
                                                                        },
                                                                        children: "原価（円）"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                        lineNumber: 456,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                lineNumber: 454,
                                                                columnNumber: 21
                                                            }, this),
                                                            editingCost && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: (e)=>{
                                                                    e.stopPropagation();
                                                                    handleSaveCost();
                                                                },
                                                                disabled: savingCost,
                                                                className: "p-1 rounded hover:bg-[var(--panel)]",
                                                                style: {
                                                                    color: 'var(--color-success)'
                                                                },
                                                                children: savingCost ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                                    size: 14,
                                                                    className: "animate-spin"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                    lineNumber: 465,
                                                                    columnNumber: 39
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                    size: 14
                                                                }, void 0, false, {
                                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                    lineNumber: 465,
                                                                    columnNumber: 88
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                lineNumber: 459,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 453,
                                                        columnNumber: 19
                                                    }, this),
                                                    editingCost ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-lg font-bold mr-1",
                                                                style: {
                                                                    color: 'var(--text)'
                                                                },
                                                                children: "¥"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                lineNumber: 471,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "number",
                                                                value: costValue,
                                                                onChange: (e)=>setCostValue(e.target.value),
                                                                onKeyDown: (e)=>handleKeyDown(e, 'cost'),
                                                                onBlur: handleSaveCost,
                                                                autoFocus: true,
                                                                className: "w-full px-2 py-1 rounded text-xl font-bold text-right",
                                                                style: {
                                                                    background: 'var(--panel)',
                                                                    color: 'var(--text)',
                                                                    border: '2px solid var(--accent)'
                                                                },
                                                                onClick: (e)=>e.stopPropagation()
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                lineNumber: 472,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 470,
                                                        columnNumber: 21
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-2xl font-bold text-center",
                                                        style: {
                                                            color: 'var(--text)'
                                                        },
                                                        children: [
                                                            "¥",
                                                            baseCost.toLocaleString()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 489,
                                                        columnNumber: 21
                                                    }, this),
                                                    !editingCost && !baseCost && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-center mt-1",
                                                        style: {
                                                            color: 'var(--text-muted)'
                                                        },
                                                        children: "未登録"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 494,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 448,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-3 rounded-lg",
                                                style: {
                                                    background: 'var(--highlight)'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 mb-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                                                size: 14,
                                                                style: {
                                                                    color: 'var(--text-muted)'
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                lineNumber: 506,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs",
                                                                style: {
                                                                    color: 'var(--text-muted)'
                                                                },
                                                                children: "販売価格"
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                lineNumber: 507,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 505,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-2xl font-bold text-center",
                                                        style: {
                                                            color: 'var(--accent)'
                                                        },
                                                        children: [
                                                            "$",
                                                            (localProduct.selling_price || 0).toFixed(2)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 509,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 501,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                        lineNumber: 394,
                                        columnNumber: 15
                                    }, this),
                                    totalCost > 0 && localProduct.selling_price && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-3 p-2 rounded text-sm text-center",
                                        style: {
                                            background: 'rgba(34, 197, 94, 0.1)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: 'var(--text-muted)'
                                                },
                                                children: "推定利益（総原価ベース）: "
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 521,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: 'var(--color-success)',
                                                    fontWeight: 600
                                                },
                                                children: [
                                                    "$",
                                                    ((localProduct.selling_price || 0) - totalCost / 150).toFixed(2),
                                                    " USD"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 522,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: 'var(--text-muted)'
                                                },
                                                children: " / "
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 525,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: 'var(--color-success)',
                                                    fontWeight: 600
                                                },
                                                children: [
                                                    "¥",
                                                    ((localProduct.selling_price || 0) * 150 - totalCost).toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 526,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                        lineNumber: 517,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                lineNumber: 390,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {}, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                lineNumber: 533,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "py-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-sm font-semibold",
                                                style: {
                                                    color: 'var(--text)'
                                                },
                                                children: "その他経費"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 538,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                                size: "sm",
                                                variant: "ghost",
                                                onClick: handleSaveCostItems,
                                                loading: savingCostItems,
                                                disabled: savingCostItems,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                        size: 14
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 548,
                                                        columnNumber: 19
                                                    }, this),
                                                    "保存"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 541,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                        lineNumber: 537,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2 mb-3",
                                        children: [
                                            costItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 p-2 rounded",
                                                    style: {
                                                        background: 'var(--highlight)'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "flex-1 text-sm",
                                                            style: {
                                                                color: 'var(--text)'
                                                            },
                                                            children: item.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                            lineNumber: 561,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm font-mono",
                                                            style: {
                                                                color: 'var(--text)'
                                                            },
                                                            children: [
                                                                "¥",
                                                                item.amount.toLocaleString()
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                            lineNumber: 564,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleRemoveCostItem(item.key),
                                                            className: "p-1 rounded hover:bg-[var(--panel)]",
                                                            style: {
                                                                color: 'var(--color-error)'
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                size: 14
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                lineNumber: 572,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                            lineNumber: 567,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, item.key, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                    lineNumber: 556,
                                                    columnNumber: 19
                                                }, this)),
                                            costItems.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-3 rounded text-sm text-center",
                                                style: {
                                                    background: 'var(--highlight)',
                                                    color: 'var(--text-muted)'
                                                },
                                                children: "経費が登録されていません"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 578,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                        lineNumber: 554,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: newCostKey,
                                                onChange: (e)=>setNewCostKey(e.target.value),
                                                className: "flex-1 px-2 py-1.5 rounded text-sm",
                                                style: {
                                                    background: 'var(--highlight)',
                                                    color: 'var(--text)',
                                                    border: '1px solid var(--panel-border)'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: "",
                                                        children: "項目を選択..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 599,
                                                        columnNumber: 19
                                                    }, this),
                                                    __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$types$2f$inventory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COST_ITEM_PRESETS"].map((preset)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: preset.key,
                                                            children: preset.label
                                                        }, preset.key, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                            lineNumber: 601,
                                                            columnNumber: 21
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 589,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm mr-1",
                                                        style: {
                                                            color: 'var(--text-muted)'
                                                        },
                                                        children: "¥"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 607,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        value: newCostAmount,
                                                        onChange: (e)=>setNewCostAmount(e.target.value),
                                                        placeholder: "金額",
                                                        className: "w-24 px-2 py-1.5 rounded text-sm text-right",
                                                        style: {
                                                            background: 'var(--highlight)',
                                                            color: 'var(--text)',
                                                            border: '1px solid var(--panel-border)'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 608,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 606,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                                size: "sm",
                                                variant: "ghost",
                                                onClick: handleAddCostItem,
                                                disabled: !newCostKey || !newCostAmount,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                    lineNumber: 627,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 621,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                        lineNumber: 588,
                                        columnNumber: 15
                                    }, this),
                                    costItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-3 p-2 rounded flex justify-between items-center",
                                        style: {
                                            background: 'rgba(245, 158, 11, 0.1)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-medium",
                                                style: {
                                                    color: 'var(--text)'
                                                },
                                                children: "経費合計"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 637,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-lg font-bold",
                                                style: {
                                                    color: 'rgb(245, 158, 11)'
                                                },
                                                children: [
                                                    "¥",
                                                    totalAdditionalCosts.toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 640,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                        lineNumber: 633,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2 p-2 rounded flex justify-between items-center",
                                        style: {
                                            background: 'rgba(59, 130, 246, 0.1)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-medium",
                                                style: {
                                                    color: 'var(--text)'
                                                },
                                                children: "総原価（原価 + 経費）"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 651,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-lg font-bold",
                                                style: {
                                                    color: 'rgb(59, 130, 246)'
                                                },
                                                children: [
                                                    "¥",
                                                    totalCost.toLocaleString()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 654,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                        lineNumber: 647,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                lineNumber: 536,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {}, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                lineNumber: 660,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "py-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-sm font-semibold flex items-center gap-2",
                                                style: {
                                                    color: 'var(--text)'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"], {
                                                        size: 14
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 666,
                                                        columnNumber: 19
                                                    }, this),
                                                    "販売予定販路 (L4)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 665,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                                size: "sm",
                                                variant: "ghost",
                                                onClick: handleSaveChannels,
                                                loading: savingChannels,
                                                disabled: savingChannels,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                        size: 14
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 676,
                                                        columnNumber: 19
                                                    }, this),
                                                    "保存"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 669,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                        lineNumber: 664,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-3 gap-2",
                                        children: Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$types$2f$inventory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SALES_CHANNEL_LABELS"]).map((param)=>{
                                            let [channel, label] = param;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "flex items-center gap-2 p-2 rounded cursor-pointer transition-all",
                                                style: {
                                                    background: selectedChannels.includes(channel) ? 'rgba(59, 130, 246, 0.15)' : 'var(--highlight)',
                                                    border: selectedChannels.includes(channel) ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid transparent'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "checkbox",
                                                        checked: selectedChannels.includes(channel),
                                                        onChange: ()=>toggleChannel(channel),
                                                        className: "rounded"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 695,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm",
                                                        style: {
                                                            color: selectedChannels.includes(channel) ? 'rgb(59, 130, 246)' : 'var(--text)',
                                                            fontWeight: selectedChannels.includes(channel) ? 600 : 400
                                                        },
                                                        children: label
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 701,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, channel, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 683,
                                                columnNumber: 19
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                        lineNumber: 681,
                                        columnNumber: 15
                                    }, this),
                                    selectedChannels.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2 text-xs",
                                        style: {
                                            color: 'var(--text-muted)'
                                        },
                                        children: [
                                            "選択中: ",
                                            selectedChannels.map((c)=>__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$types$2f$inventory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SALES_CHANNEL_LABELS"][c]).join(', ')
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                        lineNumber: 717,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                lineNumber: 663,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {}, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                lineNumber: 723,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "py-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "text-sm font-semibold mb-3",
                                        style: {
                                            color: 'var(--text)'
                                        },
                                        children: "詳細情報"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                        lineNumber: 727,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-3 text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: 'var(--text-muted)'
                                                        },
                                                        children: "カテゴリ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 732,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: 'var(--text)'
                                                        },
                                                        children: localProduct.category || '-'
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 733,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 731,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: 'var(--text-muted)'
                                                        },
                                                        children: "マーケットプレイス"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 736,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: 'var(--text)'
                                                        },
                                                        children: localProduct.marketplace || '-'
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 737,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 735,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: 'var(--text-muted)'
                                                        },
                                                        children: "仕入れ日"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 740,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: 'var(--text)'
                                                        },
                                                        children: localProduct.date_acquired ? new Date(localProduct.date_acquired).toLocaleDateString('ja-JP') : '-'
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 741,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 739,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: 'var(--text-muted)'
                                                        },
                                                        children: "優先度スコア"
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 749,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            color: 'var(--text)'
                                                        },
                                                        children: localProduct.priority_score || 0
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 750,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 748,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                        lineNumber: 730,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                lineNumber: 726,
                                columnNumber: 13
                            }, this),
                            (localProduct.is_variation_parent || localProduct.is_variation_member || localProduct.is_variation_child) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {}, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                        lineNumber: 758,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "py-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-sm font-semibold mb-3",
                                                style: {
                                                    color: 'var(--text)'
                                                },
                                                children: "バリエーション情報"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 760,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-3 text-sm",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                color: 'var(--text-muted)'
                                                            },
                                                            children: "親SKU"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                            lineNumber: 765,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                color: 'var(--text)'
                                                            },
                                                            children: localProduct.parent_sku || '-'
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                            lineNumber: 766,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                    lineNumber: 764,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 763,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                        lineNumber: 759,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true),
                            localProduct.product_type === 'set' && localProduct.set_members && localProduct.set_members.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {}, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                        lineNumber: 776,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "py-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-sm font-semibold mb-3",
                                                style: {
                                                    color: 'var(--text)'
                                                },
                                                children: "セット構成"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 778,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: localProduct.set_members.map((member, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3 p-2 rounded",
                                                        style: {
                                                            background: 'var(--highlight)'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1 text-sm",
                                                                style: {
                                                                    color: 'var(--text)'
                                                                },
                                                                children: member.product_name || member.sku || "構成品 ".concat(index + 1)
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                lineNumber: 788,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "px-2 py-1 rounded text-sm font-mono",
                                                                style: {
                                                                    color: 'var(--text)'
                                                                },
                                                                children: [
                                                                    "×",
                                                                    member.quantity || 1
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                                lineNumber: 791,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, member.product_id || index, true, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                        lineNumber: 783,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 781,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                        lineNumber: 777,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true),
                            localProduct.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {}, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                        lineNumber: 804,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "py-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-sm font-semibold mb-2",
                                                style: {
                                                    color: 'var(--text)'
                                                },
                                                children: "メモ"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 806,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-3 rounded text-sm",
                                                style: {
                                                    background: 'var(--highlight)',
                                                    color: 'var(--text-muted)'
                                                },
                                                children: localProduct.notes
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                                lineNumber: 809,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                        lineNumber: 805,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                        lineNumber: 316,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                    lineNumber: 315,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between px-4 py-3 border-t",
                    style: {
                        borderColor: 'var(--panel-border)',
                        background: 'var(--highlight)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs",
                            style: {
                                color: 'var(--text-muted)'
                            },
                            children: [
                                "更新: ",
                                localProduct.updated_at ? new Date(localProduct.updated_at).toLocaleString('ja-JP') : '-'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                            lineNumber: 826,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2",
                            children: [
                                ((_localProduct_source_data = localProduct.source_data) === null || _localProduct_source_data === void 0 ? void 0 : _localProduct_source_data.listing_url) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                    size: "sm",
                                    variant: "ghost",
                                    onClick: ()=>{
                                        var _localProduct_source_data;
                                        return window.open((_localProduct_source_data = localProduct.source_data) === null || _localProduct_source_data === void 0 ? void 0 : _localProduct_source_data.listing_url, '_blank');
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                            lineNumber: 839,
                                            columnNumber: 17
                                        }, this),
                                        "出品ページ"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                    lineNumber: 834,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                    size: "sm",
                                    variant: "secondary",
                                    onClick: onClose,
                                    children: "閉じる"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                                    lineNumber: 843,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                            lineNumber: 832,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
                    lineNumber: 822,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
            lineNumber: 281,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx",
        lineNumber: 276,
        columnNumber: 5
    }, this);
}
_s(N3InventoryDetailModal, "AD/a5WWJik2GmvHkyUNeVNZ5MCs=");
_c = N3InventoryDetailModal;
var _c;
__turbopack_context__.k.register(_c, "N3InventoryDetailModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/components/modals/n3-new-product-modal.tsx
/**
 * 新規商品作成モーダル
 * 
 * inventory_master に新規商品を手動登録するモーダル
 * L4属性（販売予定販路）とその他経費の入力に対応
 */ __turbopack_context__.s([
    "N3NewProductModal",
    ()=>N3NewProductModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/store.js [app-client] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-divider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$types$2f$inventory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/types/inventory.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function N3NewProductModal(param) {
    let { isOpen, onClose, onSubmit } = param;
    _s();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        product_name: '',
        sku: '',
        physical_quantity: 1,
        cost_price: 0,
        selling_price: 0,
        condition_name: 'New',
        category: '',
        notes: '',
        storage_location: 'plus1',
        attr_l4: [],
        additional_costs: {}
    });
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // L4属性（販売予定販路）
    const [selectedChannels, setSelectedChannels] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // その他経費
    const [costItems, setCostItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [newCostKey, setNewCostKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [newCostAmount, setNewCostAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    if (!isOpen) return null;
    const handleChange = (field, value)=>{
        setFormData((prev)=>({
                ...prev,
                [field]: value
            }));
        setError(null);
    };
    // 販路チェックボックスのトグル
    const toggleChannel = (channel)=>{
        setSelectedChannels((prev)=>{
            if (prev.includes(channel)) {
                return prev.filter((c)=>c !== channel);
            } else {
                return [
                    ...prev,
                    channel
                ];
            }
        });
    };
    // 経費項目の追加
    const handleAddCostItem = ()=>{
        if (!newCostKey || !newCostAmount) return;
        const amount = parseInt(newCostAmount) || 0;
        if (amount <= 0) return;
        const preset = __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$types$2f$inventory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COST_ITEM_PRESETS"].find((p)=>p.key === newCostKey);
        const existingIndex = costItems.findIndex((item)=>item.key === newCostKey);
        if (existingIndex >= 0) {
            setCostItems((prev)=>prev.map((item, i)=>i === existingIndex ? {
                        ...item,
                        amount
                    } : item));
        } else {
            setCostItems((prev)=>[
                    ...prev,
                    {
                        key: newCostKey,
                        label: (preset === null || preset === void 0 ? void 0 : preset.label) || newCostKey,
                        amount
                    }
                ]);
        }
        setNewCostKey('');
        setNewCostAmount('');
    };
    // 経費項目の削除
    const handleRemoveCostItem = (key)=>{
        setCostItems((prev)=>prev.filter((item)=>item.key !== key));
    };
    // 経費合計
    const totalAdditionalCosts = costItems.reduce((sum, item)=>sum + item.amount, 0);
    const handleSubmit = async ()=>{
        // バリデーション
        if (!formData.product_name.trim()) {
            setError('商品名を入力してください');
            return;
        }
        if (formData.cost_price <= 0) {
            setError('原価を入力してください');
            return;
        }
        setSaving(true);
        setError(null);
        try {
            // additional_costsをオブジェクトに変換
            const additionalCosts = {};
            for (const item of costItems){
                if (item.amount > 0) {
                    additionalCosts[item.key] = item.amount;
                }
            }
            const submitData = {
                ...formData,
                attr_l4: selectedChannels,
                additional_costs: additionalCosts
            };
            const result = await onSubmit(submitData);
            if (result.success) {
                // 成功したらフォームをリセットして閉じる
                setFormData({
                    product_name: '',
                    sku: '',
                    physical_quantity: 1,
                    cost_price: 0,
                    selling_price: 0,
                    condition_name: 'New',
                    category: '',
                    notes: '',
                    storage_location: 'plus1',
                    attr_l4: [],
                    additional_costs: {}
                });
                setSelectedChannels([]);
                setCostItems([]);
                onClose();
            } else {
                setError(result.error || '登録に失敗しました');
            }
        } catch (err) {
            setError(err.message || '登録に失敗しました');
        } finally{
            setSaving(false);
        }
    };
    const handleClose = ()=>{
        if (!saving) {
            onClose();
        }
    };
    // 総原価（原価 + 経費）
    const totalCost = formData.cost_price + totalAdditionalCosts;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[9999] flex items-center justify-center",
        style: {
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)'
        },
        onClick: handleClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-lg shadow-xl",
            style: {
                background: 'var(--panel)'
            },
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between px-4 py-3 border-b",
                    style: {
                        borderColor: 'var(--panel-border)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                    size: 18,
                                    style: {
                                        color: 'var(--accent)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                    lineNumber: 209,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold",
                                    style: {
                                        color: 'var(--text)'
                                    },
                                    children: "新規商品登録"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                    lineNumber: 210,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                            lineNumber: 208,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleClose,
                            disabled: saving,
                            className: "p-1.5 rounded hover:bg-[var(--highlight)]",
                            style: {
                                color: 'var(--text-muted)'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                lineNumber: 220,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                            lineNumber: 214,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                    lineNumber: 204,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "overflow-y-auto p-4",
                    style: {
                        maxHeight: 'calc(90vh - 140px)'
                    },
                    children: [
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4 p-3 rounded text-sm",
                            style: {
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: 'rgb(239, 68, 68)'
                            },
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                            lineNumber: 228,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium mb-1",
                                            style: {
                                                color: 'var(--text)'
                                            },
                                            children: [
                                                "商品名 ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        color: 'var(--color-error)'
                                                    },
                                                    children: "*"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                    lineNumber: 241,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                            lineNumber: 240,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: formData.product_name,
                                            onChange: (e)=>handleChange('product_name', e.target.value),
                                            placeholder: "商品名を入力",
                                            className: "w-full px-3 py-2 rounded",
                                            style: {
                                                background: 'var(--highlight)',
                                                color: 'var(--text)',
                                                border: '1px solid var(--panel-border)'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                            lineNumber: 243,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                    lineNumber: 239,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium mb-1",
                                            style: {
                                                color: 'var(--text)'
                                            },
                                            children: "SKU"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                            lineNumber: 259,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: formData.sku,
                                            onChange: (e)=>handleChange('sku', e.target.value),
                                            placeholder: "SKUを入力（空白の場合は自動生成）",
                                            className: "w-full px-3 py-2 rounded",
                                            style: {
                                                background: 'var(--highlight)',
                                                color: 'var(--text)',
                                                border: '1px solid var(--panel-border)'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                            lineNumber: 262,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                    lineNumber: 258,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-3 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium mb-1",
                                                    style: {
                                                        color: 'var(--text)'
                                                    },
                                                    children: "在庫数"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                    lineNumber: 279,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    value: formData.physical_quantity,
                                                    onChange: (e)=>handleChange('physical_quantity', parseInt(e.target.value) || 0),
                                                    min: "0",
                                                    className: "w-full px-3 py-2 rounded",
                                                    style: {
                                                        background: 'var(--highlight)',
                                                        color: 'var(--text)',
                                                        border: '1px solid var(--panel-border)'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                    lineNumber: 282,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                            lineNumber: 278,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium mb-1",
                                                    style: {
                                                        color: 'var(--text)'
                                                    },
                                                    children: "保管場所"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                    lineNumber: 298,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: formData.storage_location,
                                                    onChange: (e)=>handleChange('storage_location', e.target.value),
                                                    className: "w-full px-3 py-2 rounded",
                                                    style: {
                                                        background: 'var(--highlight)',
                                                        color: formData.storage_location === 'plus1' ? '#22c55e' : 'var(--text)',
                                                        border: '1px solid var(--panel-border)',
                                                        fontWeight: 600
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "plus1",
                                                            children: "plus1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                            lineNumber: 312,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "env",
                                                            children: "env"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                            lineNumber: 313,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                    lineNumber: 301,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                            lineNumber: 297,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium mb-1",
                                                    style: {
                                                        color: 'var(--text)'
                                                    },
                                                    children: "コンディション"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                    lineNumber: 319,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: formData.condition_name,
                                                    onChange: (e)=>handleChange('condition_name', e.target.value),
                                                    className: "w-full px-3 py-2 rounded",
                                                    style: {
                                                        background: 'var(--highlight)',
                                                        color: 'var(--text)',
                                                        border: '1px solid var(--panel-border)'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "New",
                                                            children: "New（新品）"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                            lineNumber: 332,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "Used",
                                                            children: "Used（中古）"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                            lineNumber: 333,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "Refurbished",
                                                            children: "Refurbished（再生品）"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                            lineNumber: 334,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                    lineNumber: 322,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                            lineNumber: 318,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                    lineNumber: 276,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium mb-1",
                                                    style: {
                                                        color: 'var(--text)'
                                                    },
                                                    children: [
                                                        "原価 (¥) ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                color: 'var(--color-error)'
                                                            },
                                                            children: "*"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                            lineNumber: 343,
                                                            columnNumber: 26
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                    lineNumber: 342,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    value: formData.cost_price,
                                                    onChange: (e)=>handleChange('cost_price', parseInt(e.target.value) || 0),
                                                    min: "0",
                                                    placeholder: "0",
                                                    className: "w-full px-3 py-2 rounded",
                                                    style: {
                                                        background: 'var(--highlight)',
                                                        color: 'var(--text)',
                                                        border: '1px solid var(--panel-border)'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                    lineNumber: 345,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                            lineNumber: 341,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium mb-1",
                                                    style: {
                                                        color: 'var(--text)'
                                                    },
                                                    children: "販売価格 ($)"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                    lineNumber: 362,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "number",
                                                    value: formData.selling_price,
                                                    onChange: (e)=>handleChange('selling_price', parseFloat(e.target.value) || 0),
                                                    min: "0",
                                                    step: "0.01",
                                                    placeholder: "0.00",
                                                    className: "w-full px-3 py-2 rounded",
                                                    style: {
                                                        background: 'var(--highlight)',
                                                        color: 'var(--text)',
                                                        border: '1px solid var(--panel-border)'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                    lineNumber: 365,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                            lineNumber: 361,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                    lineNumber: 339,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {}, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                    lineNumber: 382,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium mb-2",
                                            style: {
                                                color: 'var(--text)'
                                            },
                                            children: "その他経費"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                            lineNumber: 386,
                                            columnNumber: 15
                                        }, this),
                                        costItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2 mb-3",
                                            children: costItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 p-2 rounded",
                                                    style: {
                                                        background: 'var(--highlight)'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "flex-1 text-sm",
                                                            style: {
                                                                color: 'var(--text)'
                                                            },
                                                            children: item.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                            lineNumber: 399,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm font-mono",
                                                            style: {
                                                                color: 'var(--text)'
                                                            },
                                                            children: [
                                                                "¥",
                                                                item.amount.toLocaleString()
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                            lineNumber: 402,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleRemoveCostItem(item.key),
                                                            className: "p-1 rounded hover:bg-[var(--panel)]",
                                                            style: {
                                                                color: 'var(--color-error)'
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                size: 14
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                                lineNumber: 410,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                            lineNumber: 405,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, item.key, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                    lineNumber: 394,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                            lineNumber: 392,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: newCostKey,
                                                    onChange: (e)=>setNewCostKey(e.target.value),
                                                    className: "flex-1 px-2 py-1.5 rounded text-sm",
                                                    style: {
                                                        background: 'var(--highlight)',
                                                        color: 'var(--text)',
                                                        border: '1px solid var(--panel-border)'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "項目を選択..."
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                            lineNumber: 429,
                                                            columnNumber: 19
                                                        }, this),
                                                        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$types$2f$inventory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COST_ITEM_PRESETS"].map((preset)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: preset.key,
                                                                children: preset.label
                                                            }, preset.key, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                                lineNumber: 431,
                                                                columnNumber: 21
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                    lineNumber: 419,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm mr-1",
                                                            style: {
                                                                color: 'var(--text-muted)'
                                                            },
                                                            children: "¥"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                            lineNumber: 437,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            value: newCostAmount,
                                                            onChange: (e)=>setNewCostAmount(e.target.value),
                                                            placeholder: "金額",
                                                            className: "w-24 px-2 py-1.5 rounded text-sm text-right",
                                                            style: {
                                                                background: 'var(--highlight)',
                                                                color: 'var(--text)',
                                                                border: '1px solid var(--panel-border)'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                            lineNumber: 438,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                    lineNumber: 436,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                                    size: "sm",
                                                    variant: "ghost",
                                                    onClick: handleAddCostItem,
                                                    disabled: !newCostKey || !newCostAmount,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                        size: 14
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                        lineNumber: 457,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                    lineNumber: 451,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                            lineNumber: 418,
                                            columnNumber: 15
                                        }, this),
                                        costItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-2 p-2 rounded flex justify-between items-center",
                                            style: {
                                                background: 'rgba(245, 158, 11, 0.1)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-sm",
                                                    style: {
                                                        color: 'var(--text)'
                                                    },
                                                    children: "経費合計"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                    lineNumber: 467,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-bold",
                                                    style: {
                                                        color: 'rgb(245, 158, 11)'
                                                    },
                                                    children: [
                                                        "¥",
                                                        totalAdditionalCosts.toLocaleString()
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                    lineNumber: 468,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                            lineNumber: 463,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-2 p-2 rounded flex justify-between items-center",
                                            style: {
                                                background: 'rgba(59, 130, 246, 0.1)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-sm font-medium",
                                                    style: {
                                                        color: 'var(--text)'
                                                    },
                                                    children: "総原価（原価 + 経費）"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                    lineNumber: 479,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-bold",
                                                    style: {
                                                        color: 'rgb(59, 130, 246)'
                                                    },
                                                    children: [
                                                        "¥",
                                                        totalCost.toLocaleString()
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                    lineNumber: 482,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                            lineNumber: 475,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                    lineNumber: 385,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {}, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                    lineNumber: 488,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium mb-2 flex items-center gap-2",
                                            style: {
                                                color: 'var(--text)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                    lineNumber: 493,
                                                    columnNumber: 17
                                                }, this),
                                                "販売予定販路 (L4)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                            lineNumber: 492,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-3 gap-2",
                                            children: Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$types$2f$inventory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SALES_CHANNEL_LABELS"]).map((param)=>{
                                                let [channel, label] = param;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "flex items-center gap-2 p-2 rounded cursor-pointer transition-all",
                                                    style: {
                                                        background: selectedChannels.includes(channel) ? 'rgba(59, 130, 246, 0.15)' : 'var(--highlight)',
                                                        border: selectedChannels.includes(channel) ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid transparent'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "checkbox",
                                                            checked: selectedChannels.includes(channel),
                                                            onChange: ()=>toggleChannel(channel),
                                                            className: "rounded"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                            lineNumber: 511,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm",
                                                            style: {
                                                                color: selectedChannels.includes(channel) ? 'rgb(59, 130, 246)' : 'var(--text)',
                                                                fontWeight: selectedChannels.includes(channel) ? 600 : 400
                                                            },
                                                            children: label
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                            lineNumber: 517,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, channel, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                                    lineNumber: 499,
                                                    columnNumber: 19
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                            lineNumber: 497,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                    lineNumber: 491,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {}, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                    lineNumber: 533,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium mb-1",
                                            style: {
                                                color: 'var(--text)'
                                            },
                                            children: "カテゴリ"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                            lineNumber: 537,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: formData.category,
                                            onChange: (e)=>handleChange('category', e.target.value),
                                            placeholder: "カテゴリを入力",
                                            className: "w-full px-3 py-2 rounded",
                                            style: {
                                                background: 'var(--highlight)',
                                                color: 'var(--text)',
                                                border: '1px solid var(--panel-border)'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                            lineNumber: 540,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                    lineNumber: 536,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium mb-1",
                                            style: {
                                                color: 'var(--text)'
                                            },
                                            children: "メモ"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                            lineNumber: 556,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: formData.notes,
                                            onChange: (e)=>handleChange('notes', e.target.value),
                                            placeholder: "メモを入力",
                                            rows: 3,
                                            className: "w-full px-3 py-2 rounded resize-none",
                                            style: {
                                                background: 'var(--highlight)',
                                                color: 'var(--text)',
                                                border: '1px solid var(--panel-border)'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                            lineNumber: 559,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                    lineNumber: 555,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                            lineNumber: 237,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                    lineNumber: 225,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-end gap-3 px-4 py-3 border-t",
                    style: {
                        borderColor: 'var(--panel-border)',
                        background: 'var(--highlight)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                            size: "sm",
                            variant: "ghost",
                            onClick: handleClose,
                            disabled: saving,
                            children: "キャンセル"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                            lineNumber: 580,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                            size: "sm",
                            variant: "primary",
                            onClick: handleSubmit,
                            loading: saving,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                    size: 14
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                                    lineNumber: 594,
                                    columnNumber: 13
                                }, this),
                                "登録"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                            lineNumber: 588,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
                    lineNumber: 576,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
            lineNumber: 198,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx",
        lineNumber: 193,
        columnNumber: 5
    }, this);
}
_s(N3NewProductModal, "c6sf0UlAVb+4DKVtEB+3i6l6uVE=");
_c = N3NewProductModal;
var _c;
__turbopack_context__.k.register(_c, "N3NewProductModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx
/**
 * 出品先選択モーダル
 * 
 * マルチマーケットプレイス対応
 * - 複数のマーケットプレイス選択
 * - 各マーケットプレイスの複数アカウント選択
 * - 即時出品/スケジュール出品の切り替え
 */ __turbopack_context__.s([
    "N3ListingDestinationModal",
    ()=>N3ListingDestinationModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/store.js [app-client] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle.js [app-client] (ecmascript) <export default as Circle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-divider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// ============================================================
// マーケットプレイス設定（将来的にはDBから取得）
// ============================================================
const DEFAULT_MARKETPLACES = [
    {
        id: 'ebay',
        name: 'ebay',
        displayName: 'eBay',
        isEnabled: true,
        accounts: [
            {
                id: 'mjt',
                name: 'mjt',
                displayName: 'MJT (メイン)',
                isActive: true
            },
            {
                id: 'green',
                name: 'green',
                displayName: 'Green',
                isActive: true
            }
        ]
    },
    {
        id: 'amazon',
        name: 'amazon',
        displayName: 'Amazon',
        isEnabled: false,
        accounts: [
            {
                id: 'amazon_main',
                name: 'amazon_main',
                displayName: 'Amazon Main',
                isActive: false
            }
        ]
    },
    {
        id: 'mercari',
        name: 'mercari',
        displayName: 'メルカリ',
        isEnabled: false,
        accounts: [
            {
                id: 'mercari_main',
                name: 'mercari_main',
                displayName: 'メルカリ Main',
                isActive: false
            }
        ]
    },
    {
        id: 'qoo10',
        name: 'qoo10',
        displayName: 'Qoo10',
        isEnabled: false,
        accounts: [
            {
                id: 'qoo10_main',
                name: 'qoo10_main',
                displayName: 'Qoo10 Main',
                isActive: false
            }
        ]
    }
];
function N3ListingDestinationModal(param) {
    let { isOpen, onClose, onConfirm, selectedProductCount, title = '出品先を選択' } = param;
    _s();
    // State
    const [selectedDestinations, setSelectedDestinations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [expandedMarketplaces, setExpandedMarketplaces] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set([
        'ebay'
    ]));
    const [listingMode, setListingMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('immediate');
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // マーケットプレイス展開/折りたたみ
    const toggleMarketplace = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3ListingDestinationModal.useCallback[toggleMarketplace]": (marketplaceId)=>{
            setExpandedMarketplaces({
                "N3ListingDestinationModal.useCallback[toggleMarketplace]": (prev)=>{
                    const newSet = new Set(prev);
                    if (newSet.has(marketplaceId)) {
                        newSet.delete(marketplaceId);
                    } else {
                        newSet.add(marketplaceId);
                    }
                    return newSet;
                }
            }["N3ListingDestinationModal.useCallback[toggleMarketplace]"]);
        }
    }["N3ListingDestinationModal.useCallback[toggleMarketplace]"], []);
    // アカウント選択/解除
    const toggleAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3ListingDestinationModal.useCallback[toggleAccount]": (marketplace, accountId)=>{
            setSelectedDestinations({
                "N3ListingDestinationModal.useCallback[toggleAccount]": (prev)=>{
                    const exists = prev.some({
                        "N3ListingDestinationModal.useCallback[toggleAccount].exists": (d)=>d.marketplace === marketplace && d.accountId === accountId
                    }["N3ListingDestinationModal.useCallback[toggleAccount].exists"]);
                    if (exists) {
                        return prev.filter({
                            "N3ListingDestinationModal.useCallback[toggleAccount]": (d)=>!(d.marketplace === marketplace && d.accountId === accountId)
                        }["N3ListingDestinationModal.useCallback[toggleAccount]"]);
                    } else {
                        return [
                            ...prev,
                            {
                                marketplace,
                                accountId
                            }
                        ];
                    }
                }
            }["N3ListingDestinationModal.useCallback[toggleAccount]"]);
        }
    }["N3ListingDestinationModal.useCallback[toggleAccount]"], []);
    // マーケットプレイス全体選択/解除
    const toggleAllAccounts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3ListingDestinationModal.useCallback[toggleAllAccounts]": (marketplace)=>{
            const activeAccounts = marketplace.accounts.filter({
                "N3ListingDestinationModal.useCallback[toggleAllAccounts].activeAccounts": (a)=>a.isActive
            }["N3ListingDestinationModal.useCallback[toggleAllAccounts].activeAccounts"]);
            const allSelected = activeAccounts.every({
                "N3ListingDestinationModal.useCallback[toggleAllAccounts].allSelected": (account)=>selectedDestinations.some({
                        "N3ListingDestinationModal.useCallback[toggleAllAccounts].allSelected": (d)=>d.marketplace === marketplace.id && d.accountId === account.id
                    }["N3ListingDestinationModal.useCallback[toggleAllAccounts].allSelected"])
            }["N3ListingDestinationModal.useCallback[toggleAllAccounts].allSelected"]);
            setSelectedDestinations({
                "N3ListingDestinationModal.useCallback[toggleAllAccounts]": (prev)=>{
                    if (allSelected) {
                        // 全解除
                        return prev.filter({
                            "N3ListingDestinationModal.useCallback[toggleAllAccounts]": (d)=>d.marketplace !== marketplace.id
                        }["N3ListingDestinationModal.useCallback[toggleAllAccounts]"]);
                    } else {
                        // 全選択
                        const others = prev.filter({
                            "N3ListingDestinationModal.useCallback[toggleAllAccounts].others": (d)=>d.marketplace !== marketplace.id
                        }["N3ListingDestinationModal.useCallback[toggleAllAccounts].others"]);
                        const newSelections = activeAccounts.map({
                            "N3ListingDestinationModal.useCallback[toggleAllAccounts].newSelections": (account)=>({
                                    marketplace: marketplace.id,
                                    accountId: account.id
                                })
                        }["N3ListingDestinationModal.useCallback[toggleAllAccounts].newSelections"]);
                        return [
                            ...others,
                            ...newSelections
                        ];
                    }
                }
            }["N3ListingDestinationModal.useCallback[toggleAllAccounts]"]);
        }
    }["N3ListingDestinationModal.useCallback[toggleAllAccounts]"], [
        selectedDestinations
    ]);
    // 選択されているかチェック
    const isAccountSelected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3ListingDestinationModal.useCallback[isAccountSelected]": (marketplace, accountId)=>{
            return selectedDestinations.some({
                "N3ListingDestinationModal.useCallback[isAccountSelected]": (d)=>d.marketplace === marketplace && d.accountId === accountId
            }["N3ListingDestinationModal.useCallback[isAccountSelected]"]);
        }
    }["N3ListingDestinationModal.useCallback[isAccountSelected]"], [
        selectedDestinations
    ]);
    // 出品先の総数
    const totalListings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "N3ListingDestinationModal.useMemo[totalListings]": ()=>{
            return selectedProductCount * selectedDestinations.length;
        }
    }["N3ListingDestinationModal.useMemo[totalListings]"], [
        selectedProductCount,
        selectedDestinations.length
    ]);
    // 送信処理
    const handleConfirm = async ()=>{
        if (selectedDestinations.length === 0) return;
        setIsSubmitting(true);
        try {
            await onConfirm(selectedDestinations, {
                mode: listingMode
            });
            onClose();
        } catch (error) {
            console.error('出品エラー:', error);
        } finally{
            setIsSubmitting(false);
        }
    };
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[9999] flex items-center justify-center",
        style: {
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-lg shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col",
            style: {
                background: 'var(--panel)',
                border: '1px solid var(--panel-border)'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between px-5 py-4",
                    style: {
                        borderBottom: '1px solid var(--panel-border)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"], {
                                    size: 20,
                                    style: {
                                        color: 'var(--accent)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                    lineNumber: 209,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-semibold",
                                    style: {
                                        color: 'var(--text)'
                                    },
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                    lineNumber: 210,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                            lineNumber: 208,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "p-1 rounded hover:bg-white/10 transition-colors",
                            style: {
                                color: 'var(--text-muted)'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                lineNumber: 219,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                            lineNumber: 214,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                    lineNumber: 204,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 overflow-y-auto px-5 py-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4 p-3 rounded-lg",
                            style: {
                                background: 'var(--highlight)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm",
                                    style: {
                                        color: 'var(--text-muted)'
                                    },
                                    children: "選択中の商品"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                    lineNumber: 230,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xl font-bold",
                                    style: {
                                        color: 'var(--text)'
                                    },
                                    children: [
                                        selectedProductCount,
                                        " 件"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                    lineNumber: 233,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                            lineNumber: 226,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs font-semibold mb-2",
                                    style: {
                                        color: 'var(--text-muted)'
                                    },
                                    children: "出品方法"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                    lineNumber: 240,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setListingMode('immediate'),
                                            className: "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all",
                                            style: {
                                                background: listingMode === 'immediate' ? 'var(--accent)' : 'var(--highlight)',
                                                color: listingMode === 'immediate' ? 'white' : 'var(--text)',
                                                border: listingMode === 'immediate' ? 'none' : '1px solid var(--panel-border)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                    size: 18
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                                    lineNumber: 253,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-medium",
                                                    children: "今すぐ出品"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                                    lineNumber: 254,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                            lineNumber: 244,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setListingMode('scheduled'),
                                            className: "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all",
                                            style: {
                                                background: listingMode === 'scheduled' ? 'var(--accent)' : 'var(--highlight)',
                                                color: listingMode === 'scheduled' ? 'white' : 'var(--text)',
                                                border: listingMode === 'scheduled' ? 'none' : '1px solid var(--panel-border)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                    size: 18
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                                    lineNumber: 265,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-medium",
                                                    children: "スケジュール"
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                                    lineNumber: 266,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                            lineNumber: 256,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                    lineNumber: 243,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                            lineNumber: 239,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$divider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Divider"], {
                            style: {
                                margin: '16px 0'
                            }
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                            lineNumber: 271,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs font-semibold mb-2",
                                    style: {
                                        color: 'var(--text-muted)'
                                    },
                                    children: "出品先マーケットプレイス"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                    lineNumber: 275,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: DEFAULT_MARKETPLACES.map((marketplace)=>{
                                        const isExpanded = expandedMarketplaces.has(marketplace.id);
                                        const activeAccounts = marketplace.accounts.filter((a)=>a.isActive);
                                        const selectedCount = selectedDestinations.filter((d)=>d.marketplace === marketplace.id).length;
                                        const allSelected = activeAccounts.length > 0 && selectedCount === activeAccounts.length;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-lg overflow-hidden",
                                            style: {
                                                background: 'var(--highlight)',
                                                opacity: marketplace.isEnabled ? 1 : 0.5
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors",
                                                    onClick: ()=>marketplace.isEnabled && toggleMarketplace(marketplace.id),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                if (marketplace.isEnabled) {
                                                                    toggleAllAccounts(marketplace);
                                                                }
                                                            },
                                                            disabled: !marketplace.isEnabled,
                                                            className: "flex-shrink-0",
                                                            children: allSelected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                size: 20,
                                                                style: {
                                                                    color: 'var(--accent)'
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                                                lineNumber: 311,
                                                                columnNumber: 27
                                                            }, this) : selectedCount > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                                                                style: {
                                                                    borderColor: 'var(--accent)',
                                                                    background: 'var(--accent)'
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs text-white font-bold",
                                                                    children: selectedCount
                                                                }, void 0, false, {
                                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                                                    lineNumber: 317,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                                                lineNumber: 313,
                                                                columnNumber: 27
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__["Circle"], {
                                                                size: 20,
                                                                style: {
                                                                    color: 'var(--text-muted)'
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                                                lineNumber: 320,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                                            lineNumber: 300,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"], {
                                                            size: 18,
                                                            style: {
                                                                color: marketplace.isEnabled ? 'var(--text)' : 'var(--text-muted)'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                                            lineNumber: 324,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "flex-1 font-medium",
                                                            style: {
                                                                color: marketplace.isEnabled ? 'var(--text)' : 'var(--text-muted)'
                                                            },
                                                            children: marketplace.displayName
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                                            lineNumber: 326,
                                                            columnNumber: 23
                                                        }, this),
                                                        !marketplace.isEnabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs px-2 py-0.5 rounded",
                                                            style: {
                                                                background: 'var(--panel)',
                                                                color: 'var(--text-muted)'
                                                            },
                                                            children: "準備中"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                                            lineNumber: 334,
                                                            columnNumber: 25
                                                        }, this),
                                                        marketplace.isEnabled && (isExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                            size: 18
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                                            lineNumber: 343,
                                                            columnNumber: 38
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                            size: 18
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                                            lineNumber: 343,
                                                            columnNumber: 66
                                                        }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                                    lineNumber: 296,
                                                    columnNumber: 21
                                                }, this),
                                                isExpanded && marketplace.isEnabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "px-4 pb-3",
                                                    style: {
                                                        borderTop: '1px solid var(--panel-border)'
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "pt-2 space-y-1",
                                                        children: marketplace.accounts.map((account)=>{
                                                            const isSelected = isAccountSelected(marketplace.id, account.id);
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>account.isActive && toggleAccount(marketplace.id, account.id),
                                                                disabled: !account.isActive,
                                                                className: "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                                                                style: {
                                                                    background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                                                                    opacity: account.isActive ? 1 : 0.5
                                                                },
                                                                children: [
                                                                    isSelected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                        size: 16,
                                                                        style: {
                                                                            color: 'var(--accent)'
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                                                        lineNumber: 369,
                                                                        columnNumber: 35
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Circle$3e$__["Circle"], {
                                                                        size: 16,
                                                                        style: {
                                                                            color: 'var(--text-muted)'
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                                                        lineNumber: 371,
                                                                        columnNumber: 35
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-sm",
                                                                        style: {
                                                                            color: isSelected ? 'var(--accent)' : 'var(--text)'
                                                                        },
                                                                        children: account.displayName
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                                                        lineNumber: 373,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    !account.isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs ml-auto",
                                                                        style: {
                                                                            color: 'var(--text-muted)'
                                                                        },
                                                                        children: "無効"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                                                        lineNumber: 380,
                                                                        columnNumber: 35
                                                                    }, this)
                                                                ]
                                                            }, account.id, true, {
                                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                                                lineNumber: 358,
                                                                columnNumber: 31
                                                            }, this);
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                                        lineNumber: 353,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                                    lineNumber: 349,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, marketplace.id, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                            lineNumber: 287,
                                            columnNumber: 19
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                    lineNumber: 279,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                            lineNumber: 274,
                            columnNumber: 11
                        }, this),
                        selectedDestinations.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-3 rounded-lg flex items-center gap-3",
                            style: {
                                background: 'rgba(59, 130, 246, 0.1)',
                                border: '1px solid var(--accent)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                    size: 18,
                                    style: {
                                        color: 'var(--accent)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                    lineNumber: 405,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm",
                                    style: {
                                        color: 'var(--text)'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-bold",
                                            children: totalListings
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                            lineNumber: 407,
                                            columnNumber: 17
                                        }, this),
                                        " 件の出品が作成されます",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs ml-2",
                                            style: {
                                                color: 'var(--text-muted)'
                                            },
                                            children: [
                                                "(",
                                                selectedProductCount,
                                                "商品 × ",
                                                selectedDestinations.length,
                                                "出品先)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                            lineNumber: 408,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                    lineNumber: 406,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                            lineNumber: 401,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                    lineNumber: 224,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between px-5 py-4",
                    style: {
                        borderTop: '1px solid var(--panel-border)',
                        background: 'var(--highlight)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm",
                            style: {
                                color: 'var(--text-muted)'
                            },
                            children: selectedDestinations.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium",
                                        style: {
                                            color: 'var(--text)'
                                        },
                                        children: selectedDestinations.length
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                        lineNumber: 424,
                                        columnNumber: 17
                                    }, this),
                                    " 件の出品先を選択中"
                                ]
                            }, void 0, true) : '出品先を選択してください'
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                            lineNumber: 421,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                    variant: "secondary",
                                    onClick: onClose,
                                    disabled: isSubmitting,
                                    children: "キャンセル"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                    lineNumber: 434,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                                    variant: "primary",
                                    onClick: handleConfirm,
                                    disabled: selectedDestinations.length === 0 || isSubmitting,
                                    children: isSubmitting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                                lineNumber: 448,
                                                columnNumber: 19
                                            }, this),
                                            "処理中..."
                                        ]
                                    }, void 0, true) : listingMode === 'immediate' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                size: 16,
                                                className: "mr-1"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                                lineNumber: 453,
                                                columnNumber: 19
                                            }, this),
                                            "今すぐ出品"
                                        ]
                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                size: 16,
                                                className: "mr-1"
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                                lineNumber: 458,
                                                columnNumber: 19
                                            }, this),
                                            "スケジュール登録"
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                                    lineNumber: 441,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                            lineNumber: 433,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
                    lineNumber: 417,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
            lineNumber: 199,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx",
        lineNumber: 195,
        columnNumber: 5
    }, this);
}
_s(N3ListingDestinationModal, "d/uiHK6sjchqHhhv317HatmWy4U=");
_c = N3ListingDestinationModal;
var _c;
__turbopack_context__.k.register(_c, "N3ListingDestinationModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx
/**
 * セット品構成管理モーダル
 * 
 * 機能:
 * - セット品の構成シングル一覧表示
 * - 構成の追加・削除
 * - セット在庫の計算表示
 * - ボトルネック警告表示
 */ __turbopack_context__.s([
    "N3BundleCompositionModal",
    ()=>N3BundleCompositionModal,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/info.js [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$bundle$2d$items$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/hooks/use-bundle-items.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function N3BundleCompositionModal(param) {
    let { isOpen, onClose, productId, productName, productSku, onSaved } = param;
    _s();
    const { loading, error, components, setStock, searchResults, fetchComponents, addComponent, removeComponent, searchInventory, clearSearchResults } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$bundle$2d$items$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBundleItems"])();
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isSearching, setIsSearching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [addQuantity, setAddQuantity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    // モーダルを開いた時にデータを取得
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3BundleCompositionModal.useEffect": ()=>{
            if (isOpen && productId) {
                fetchComponents(productId);
                clearSearchResults();
                setSearchQuery('');
            }
        }
    }["N3BundleCompositionModal.useEffect"], [
        isOpen,
        productId,
        fetchComponents,
        clearSearchResults
    ]);
    // 検索実行
    const handleSearch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3BundleCompositionModal.useCallback[handleSearch]": async ()=>{
            if (!searchQuery.trim()) return;
            setIsSearching(true);
            const existingIds = components.map({
                "N3BundleCompositionModal.useCallback[handleSearch].existingIds": (c)=>{
                    var _c_inventory;
                    return (_c_inventory = c.inventory) === null || _c_inventory === void 0 ? void 0 : _c_inventory.id;
                }
            }["N3BundleCompositionModal.useCallback[handleSearch].existingIds"]).filter(Boolean);
            existingIds.push(productId); // 自分自身も除外
            await searchInventory(searchQuery, existingIds, true);
            setIsSearching(false);
        }
    }["N3BundleCompositionModal.useCallback[handleSearch]"], [
        searchQuery,
        components,
        productId,
        searchInventory
    ]);
    // 構成追加
    const handleAdd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3BundleCompositionModal.useCallback[handleAdd]": async (inventoryId)=>{
            const qty = addQuantity[inventoryId] || 1;
            const result = await addComponent(productId, inventoryId, qty);
            if (result.success) {
                clearSearchResults();
                setSearchQuery('');
                setAddQuantity({
                    "N3BundleCompositionModal.useCallback[handleAdd]": (prev)=>{
                        const newState = {
                            ...prev
                        };
                        delete newState[inventoryId];
                        return newState;
                    }
                }["N3BundleCompositionModal.useCallback[handleAdd]"]);
                onSaved === null || onSaved === void 0 ? void 0 : onSaved();
            }
        }
    }["N3BundleCompositionModal.useCallback[handleAdd]"], [
        productId,
        addQuantity,
        addComponent,
        clearSearchResults,
        onSaved
    ]);
    // 構成削除
    const handleRemove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3BundleCompositionModal.useCallback[handleRemove]": async (bundleItemId)=>{
            if (!confirm('この構成アイテムを削除しますか？')) return;
            const result = await removeComponent(bundleItemId, productId);
            if (result.success) {
                onSaved === null || onSaved === void 0 ? void 0 : onSaved();
            }
        }
    }["N3BundleCompositionModal.useCallback[handleRemove]"], [
        productId,
        removeComponent,
        onSaved
    ]);
    // キーボードショートカット
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3BundleCompositionModal.useEffect": ()=>{
            const handleKeyDown = {
                "N3BundleCompositionModal.useEffect.handleKeyDown": (e)=>{
                    if (e.key === 'Escape') {
                        onClose();
                    }
                }
            }["N3BundleCompositionModal.useEffect.handleKeyDown"];
            if (isOpen) {
                document.addEventListener('keydown', handleKeyDown);
            }
            return ({
                "N3BundleCompositionModal.useEffect": ()=>{
                    document.removeEventListener('keydown', handleKeyDown);
                }
            })["N3BundleCompositionModal.useEffect"];
        }
    }["N3BundleCompositionModal.useEffect"], [
        isOpen,
        onClose
    ]);
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        },
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                backgroundColor: 'var(--panel, #1e1e1e)',
                borderRadius: 12,
                width: '90%',
                maxWidth: 700,
                maxHeight: '85vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
            },
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: 16,
                        borderBottom: '1px solid var(--panel-border, #333)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                    size: 24,
                                    style: {
                                        color: 'var(--accent, #6366f1)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                                    lineNumber: 161,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            style: {
                                                margin: 0,
                                                fontSize: 16,
                                                fontWeight: 600
                                            },
                                            children: "セット品構成管理"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                                            lineNumber: 163,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                fontSize: 12,
                                                color: 'var(--text-muted, #888)',
                                                marginTop: 2
                                            },
                                            children: [
                                                productSku && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        productSku,
                                                        " | "
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                                                    lineNumber: 167,
                                                    columnNumber: 32
                                                }, this),
                                                productName || productId
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                                            lineNumber: 166,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                                    lineNumber: 162,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                            lineNumber: 160,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            style: {
                                padding: 8,
                                background: 'transparent',
                                border: 'none',
                                borderRadius: 6,
                                cursor: 'pointer',
                                color: 'var(--text-muted, #888)'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                                lineNumber: 183,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                            lineNumber: 172,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                    lineNumber: 151,
                    columnNumber: 9
                }, this),
                setStock && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: 12,
                        margin: 12,
                        marginBottom: 0,
                        background: setStock.availableSetCount <= 0 ? 'rgba(239, 68, 68, 0.1)' : setStock.availableSetCount <= 3 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                        borderRadius: 8,
                        border: "1px solid ".concat(setStock.availableSetCount <= 0 ? 'rgba(239, 68, 68, 0.3)' : setStock.availableSetCount <= 3 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(34, 197, 94, 0.3)')
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                            },
                            children: [
                                setStock.availableSetCount <= 3 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                    size: 18,
                                    style: {
                                        color: setStock.availableSetCount <= 0 ? '#ef4444' : '#f59e0b'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                                    lineNumber: 211,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                    size: 18,
                                    style: {
                                        color: '#22c55e'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                                    lineNumber: 213,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontWeight: 500
                                    },
                                    children: [
                                        "販売可能セット数: ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: setStock.availableSetCount
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                                            lineNumber: 216,
                                            columnNumber: 27
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                                    lineNumber: 215,
                                    columnNumber: 15
                                }, this),
                                !setStock.hasComponents && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: 12,
                                        color: 'var(--text-muted)'
                                    },
                                    children: "（構成未登録）"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                                    lineNumber: 219,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                            lineNumber: 209,
                            columnNumber: 13
                        }, this),
                        setStock.bottleneck && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: 12,
                                color: 'var(--text-muted)',
                                marginTop: 6
                            },
                            children: [
                                "ボトルネック: ",
                                setStock.bottleneck.productName,
                                "（SKU: ",
                                setStock.bottleneck.sku,
                                "） - 利用可能: ",
                                setStock.bottleneck.availableQty,
                                "個 / 必要: ",
                                setStock.bottleneck.requiredQty,
                                "個/セット"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                            lineNumber: 226,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                    lineNumber: 189,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        flex: 1,
                        overflow: 'auto',
                        padding: 16
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                            style: {
                                margin: '0 0 12px',
                                fontSize: 14,
                                fontWeight: 500
                            },
                            children: [
                                "構成アイテム (",
                                components.length,
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                            lineNumber: 238,
                            columnNumber: 11
                        }, this),
                        loading && components.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                textAlign: 'center',
                                padding: 24,
                                color: 'var(--text-muted)'
                            },
                            children: "読み込み中..."
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                            lineNumber: 243,
                            columnNumber: 13
                        }, this) : components.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                textAlign: 'center',
                                padding: 24,
                                color: 'var(--text-muted)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                    size: 32,
                                    style: {
                                        opacity: 0.3,
                                        marginBottom: 8
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                                    lineNumber: 248,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: "構成アイテムがありません"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                                    lineNumber: 249,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: 12
                                    },
                                    children: "下の検索から追加してください"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                                    lineNumber: 250,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                            lineNumber: 247,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8
                            },
                            children: components.map((comp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ComponentRow, {
                                    component: comp,
                                    onRemove: ()=>handleRemove(comp.id)
                                }, comp.id, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                                    lineNumber: 255,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                            lineNumber: 253,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                    lineNumber: 237,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: 16,
                        borderTop: '1px solid var(--panel-border, #333)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                            style: {
                                margin: '0 0 12px',
                                fontSize: 14
                            },
                            children: "シングルを追加"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                            lineNumber: 267,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                gap: 8,
                                marginBottom: 12
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: searchQuery,
                                    onChange: (e)=>setSearchQuery(e.target.value),
                                    onKeyDown: (e)=>e.key === 'Enter' && handleSearch(),
                                    placeholder: "SKUまたは商品名で検索...",
                                    style: {
                                        flex: 1,
                                        padding: '8px 12px',
                                        border: '1px solid var(--panel-border, #333)',
                                        borderRadius: 6,
                                        background: 'var(--panel, #1e1e1e)',
                                        color: 'var(--text, #fff)',
                                        fontSize: 14
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                                    lineNumber: 270,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleSearch,
                                    disabled: isSearching || !searchQuery.trim(),
                                    style: {
                                        padding: '8px 16px',
                                        background: 'var(--accent, #6366f1)',
                                        border: 'none',
                                        borderRadius: 6,
                                        cursor: isSearching || !searchQuery.trim() ? 'not-allowed' : 'pointer',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        opacity: isSearching || !searchQuery.trim() ? 0.5 : 1
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                            size: 16
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                                            lineNumber: 302,
                                            columnNumber: 15
                                        }, this),
                                        isSearching ? '検索中...' : '検索'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                                    lineNumber: 286,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                            lineNumber: 269,
                            columnNumber: 11
                        }, this),
                        searchResults.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                maxHeight: 200,
                                overflow: 'auto',
                                border: '1px solid var(--panel-border, #333)',
                                borderRadius: 6
                            },
                            children: searchResults.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SearchResultRow, {
                                    item: item,
                                    quantity: addQuantity[item.id] || 1,
                                    onQuantityChange: (qty)=>setAddQuantity((prev)=>({
                                                ...prev,
                                                [item.id]: qty
                                            })),
                                    onAdd: ()=>handleAdd(item.id)
                                }, item.id, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                                    lineNumber: 318,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                            lineNumber: 309,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                    lineNumber: 266,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: 12,
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        textAlign: 'center',
                        fontSize: 13
                    },
                    children: error
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                    lineNumber: 332,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
            lineNumber: 136,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
        lineNumber: 121,
        columnNumber: 5
    }, this);
}
_s(N3BundleCompositionModal, "0gHlomSwC6hE1SbCnMP47BP4mAA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$hooks$2f$use$2d$bundle$2d$items$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBundleItems"]
    ];
});
_c = N3BundleCompositionModal;
// 構成アイテム行コンポーネント
function ComponentRow(param) {
    let { component, onRemove } = param;
    var _inv_images;
    const inv = component.inventory;
    if (!inv) return null;
    const available = (inv.physical_quantity || 0) - (inv.reserved_quantity || 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: 12,
            background: 'var(--highlight, rgba(255,255,255,0.05))',
            borderRadius: 8
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 48,
                    height: 48,
                    borderRadius: 6,
                    background: 'var(--panel, #1e1e1e)',
                    overflow: 'hidden',
                    flexShrink: 0
                },
                children: ((_inv_images = inv.images) === null || _inv_images === void 0 ? void 0 : _inv_images[0]) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: inv.images[0],
                    alt: "",
                    style: {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                    lineNumber: 385,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                lineNumber: 374,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    minWidth: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontWeight: 500,
                            fontSize: 14,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        },
                        children: inv.product_name
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                        lineNumber: 395,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 12,
                            color: 'var(--text-muted, #888)'
                        },
                        children: [
                            inv.sku,
                            " | 在庫: ",
                            inv.physical_quantity,
                            " (利用可能: ",
                            available,
                            ") |",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                style: {
                                    color: 'var(--accent, #6366f1)'
                                },
                                children: [
                                    " 使用: ",
                                    component.quantity,
                                    "個/セット"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                                lineNumber: 400,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                        lineNumber: 398,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                lineNumber: 394,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onRemove,
                style: {
                    padding: 8,
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    color: '#ef4444',
                    flexShrink: 0
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                    size: 16
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                    lineNumber: 417,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                lineNumber: 405,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
        lineNumber: 363,
        columnNumber: 5
    }, this);
}
_c1 = ComponentRow;
// 検索結果行コンポーネント
function SearchResultRow(param) {
    let { item, quantity, onQuantityChange, onAdd } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: 8,
            borderBottom: '1px solid var(--panel-border, #333)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    width: 36,
                    height: 36,
                    borderRadius: 4,
                    background: 'var(--panel, #1e1e1e)',
                    overflow: 'hidden',
                    flexShrink: 0
                },
                children: item.image_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: item.image_url,
                    alt: "",
                    style: {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                    lineNumber: 457,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                lineNumber: 446,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    fontSize: 13,
                    minWidth: 0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        },
                        children: item.product_name
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                        lineNumber: 467,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontSize: 11,
                            color: 'var(--text-muted, #888)'
                        },
                        children: [
                            item.sku,
                            " | 在庫: ",
                            item.available_quantity
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                        lineNumber: 470,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                lineNumber: 466,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "number",
                min: 1,
                value: quantity,
                onChange: (e)=>onQuantityChange(Math.max(1, parseInt(e.target.value) || 1)),
                style: {
                    width: 50,
                    padding: '4px 8px',
                    border: '1px solid var(--panel-border, #333)',
                    borderRadius: 4,
                    background: 'var(--panel, #1e1e1e)',
                    color: 'var(--text, #fff)',
                    textAlign: 'center',
                    fontSize: 12
                }
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                lineNumber: 476,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onAdd,
                style: {
                    padding: '6px 12px',
                    background: 'var(--success, #22c55e)',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    color: 'white',
                    fontSize: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                        size: 14
                    }, void 0, false, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                        lineNumber: 509,
                        columnNumber: 9
                    }, this),
                    "追加"
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
                lineNumber: 494,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx",
        lineNumber: 436,
        columnNumber: 5
    }, this);
}
_c2 = SearchResultRow;
const __TURBOPACK__default__export__ = N3BundleCompositionModal;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "N3BundleCompositionModal");
__turbopack_context__.k.register(_c1, "ComponentRow");
__turbopack_context__.k.register(_c2, "SearchResultRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * N3 eBay CSV Export Modal
 * 
 * eBay File Exchange / Seller Hub Reports 形式のCSVエクスポートモーダル
 * 
 * サポートする機能:
 * - アクション: Add, Revise, Relist, VerifyAdd, Draft
 * - フォーマット: FixedPrice (GTC), Auction
 * - サイト: US, UK, AU, DE
 * - アカウント: MJT, GREEN
 * - Item Specifics: C:Brand, C:MPN, C:Type 等（カテゴリ依存）
 * - ビジネスポリシー: PolicyPayment, PolicyShipping, PolicyReturn
 * - HTML説明文対応
 * - 画像URL（最大12枚、|区切り）
 */ __turbopack_context__.s([
    "N3EbayCSVExportModal",
    ()=>N3EbayCSVExportModal,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-client] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/settings-2.js [app-client] (ecmascript) <export default as Settings2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/info.js [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gavel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gavel$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/gavel.js [app-client] (ecmascript) <export default as Gavel>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-client] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/tag.js [app-client] (ecmascript) <export default as Tag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
// シンプルなモーダルラッパー
const SimpleModal = (param)=>{
    let { isOpen, onClose, title, children } = param;
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)'
                },
                onClick: onClose
            }, void 0, false, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'relative',
                    background: 'var(--panel)',
                    borderRadius: '12px',
                    maxWidth: '720px',
                    width: '90%',
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px 20px',
                            borderBottom: '1px solid var(--panel-border)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: {
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: 'var(--text)',
                                    margin: 0
                                },
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                lineNumber: 34,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onClose,
                                style: {
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    borderRadius: '4px'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 20,
                                    style: {
                                        color: 'var(--text-muted)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                    lineNumber: 36,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                lineNumber: 35,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    children
                ]
            }, void 0, true, {
                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = SimpleModal;
// ============================================================
// 定数
// ============================================================
const ACTION_OPTIONS = [
    {
        value: 'Add',
        label: '新規出品 (Add)',
        description: '新しい商品をeBayに出品',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"]
    },
    {
        value: 'Revise',
        label: '更新 (Revise)',
        description: '既存出品の情報を更新（ItemID必須）',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__["Settings2"]
    },
    {
        value: 'Relist',
        label: '再出品 (Relist)',
        description: '終了した出品を再出品（ItemID必須）',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"]
    },
    {
        value: 'VerifyAdd',
        label: '検証 (VerifyAdd)',
        description: '出品せずにエラーチェックのみ',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"]
    },
    {
        value: 'Draft',
        label: '下書き (Draft)',
        description: 'Seller Hubの下書きとして保存',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"]
    }
];
const FORMAT_OPTIONS = [
    {
        value: 'FixedPrice',
        label: '定額出品',
        description: 'Buy It Now / 即決価格',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"]
    },
    {
        value: 'Auction',
        label: 'オークション',
        description: '競売形式',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gavel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gavel$3e$__["Gavel"]
    }
];
const SITE_OPTIONS = [
    {
        value: 'US',
        label: 'eBay.com (US)',
        flag: '🇺🇸',
        currency: 'USD'
    },
    {
        value: 'UK',
        label: 'eBay.co.uk (UK)',
        flag: '🇬🇧',
        currency: 'GBP'
    },
    {
        value: 'AU',
        label: 'eBay.com.au (AU)',
        flag: '🇦🇺',
        currency: 'AUD'
    },
    {
        value: 'DE',
        label: 'eBay.de (DE)',
        flag: '🇩🇪',
        currency: 'EUR'
    }
];
const ACCOUNT_OPTIONS = [
    {
        value: 'MJT',
        label: 'MJT',
        color: '#3b82f6'
    },
    {
        value: 'GREEN',
        label: 'GREEN',
        color: '#22c55e'
    }
];
const DURATION_OPTIONS = [
    {
        value: 'GTC',
        label: 'GTC (無期限)',
        forAuction: false,
        forFixedPrice: true
    },
    {
        value: '30',
        label: '30日',
        forAuction: false,
        forFixedPrice: true
    },
    {
        value: '1',
        label: '1日',
        forAuction: true,
        forFixedPrice: false
    },
    {
        value: '3',
        label: '3日',
        forAuction: true,
        forFixedPrice: false
    },
    {
        value: '5',
        label: '5日',
        forAuction: true,
        forFixedPrice: false
    },
    {
        value: '7',
        label: '7日',
        forAuction: true,
        forFixedPrice: false
    },
    {
        value: '10',
        label: '10日',
        forAuction: true,
        forFixedPrice: false
    }
];
// ============================================================
// ヘルパー関数
// ============================================================
const detectAccountFromProducts = (products)=>{
    for (const p of products){
        // 1. ebay_account/accountフィールドから
        if (p.ebay_account || p.account) {
            const acc = (p.ebay_account || p.account).toUpperCase();
            if (acc.includes('MJT')) return 'MJT';
            if (acc.includes('GREEN')) return 'GREEN';
        }
        // 2. SKUから推定
        // パターン: INV-ebay-mjt-{itemId}, INV-ebay-green-{itemId}, MJT-xxx, GRN-xxx
        if (p.sku) {
            const sku = p.sku.toLowerCase();
            if (sku.includes('-mjt-') || sku.startsWith('mjt')) return 'MJT';
            if (sku.includes('-green-') || sku.startsWith('grn')) return 'GREEN';
        }
    }
    return null;
};
const detectSiteFromProducts = (products)=>{
    for (const p of products){
        if (p.ebay_site || p.site) {
            const site = (p.ebay_site || p.site).toUpperCase();
            if (site === 'US' || site === 'EBAY.COM') return 'US';
            if (site === 'UK' || site === 'GB' || site === 'EBAY.CO.UK') return 'UK';
            if (site === 'AU' || site === 'EBAY.COM.AU') return 'AU';
            if (site === 'DE' || site === 'EBAY.DE') return 'DE';
        }
    }
    return null;
};
const hasItemIds = (products)=>{
    return products.some((p)=>{
        var _p_listing_data;
        return p.item_id || p.ebay_item_id || ((_p_listing_data = p.listing_data) === null || _p_listing_data === void 0 ? void 0 : _p_listing_data.item_id);
    });
};
const getCategoryStats = (products)=>{
    const stats = new Map();
    for (const p of products){
        const catId = p.category_id || p.ebay_category_id || 'unknown';
        const catName = p.category_name || "カテゴリ ".concat(catId);
        const key = "".concat(catId, "|").concat(catName);
        stats.set(key, (stats.get(key) || 0) + 1);
    }
    return stats;
};
const N3EbayCSVExportModal = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c1 = _s(function N3EbayCSVExportModal(param) {
    let { isOpen, onClose, selectedProducts, onExport } = param;
    _s();
    // 状態
    const [options, setOptions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        action: 'Add',
        format: 'FixedPrice',
        site: 'US',
        account: 'MJT',
        duration: 'GTC',
        includeItemSpecifics: true,
        includeHtml: true,
        includeBusinessPolicies: true,
        overrideQuantity: null,
        scheduleTime: null,
        groupByCategory: false
    });
    const [isExporting, setIsExporting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showAdvanced, setShowAdvanced] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 自動検出
    const detectedAccount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "N3EbayCSVExportModal.N3EbayCSVExportModal.useMemo[detectedAccount]": ()=>detectAccountFromProducts(selectedProducts)
    }["N3EbayCSVExportModal.N3EbayCSVExportModal.useMemo[detectedAccount]"], [
        selectedProducts
    ]);
    const detectedSite = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "N3EbayCSVExportModal.N3EbayCSVExportModal.useMemo[detectedSite]": ()=>detectSiteFromProducts(selectedProducts)
    }["N3EbayCSVExportModal.N3EbayCSVExportModal.useMemo[detectedSite]"], [
        selectedProducts
    ]);
    const hasExistingItemIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "N3EbayCSVExportModal.N3EbayCSVExportModal.useMemo[hasExistingItemIds]": ()=>hasItemIds(selectedProducts)
    }["N3EbayCSVExportModal.N3EbayCSVExportModal.useMemo[hasExistingItemIds]"], [
        selectedProducts
    ]);
    const categoryStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "N3EbayCSVExportModal.N3EbayCSVExportModal.useMemo[categoryStats]": ()=>getCategoryStats(selectedProducts)
    }["N3EbayCSVExportModal.N3EbayCSVExportModal.useMemo[categoryStats]"], [
        selectedProducts
    ]);
    // 推奨アクション
    const recommendedAction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "N3EbayCSVExportModal.N3EbayCSVExportModal.useMemo[recommendedAction]": ()=>{
            if (hasExistingItemIds) return 'Revise';
            return 'Add';
        }
    }["N3EbayCSVExportModal.N3EbayCSVExportModal.useMemo[recommendedAction]"], [
        hasExistingItemIds
    ]);
    // Duration options filtered by format
    const availableDurations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "N3EbayCSVExportModal.N3EbayCSVExportModal.useMemo[availableDurations]": ()=>{
            return DURATION_OPTIONS.filter({
                "N3EbayCSVExportModal.N3EbayCSVExportModal.useMemo[availableDurations]": (d)=>options.format === 'Auction' ? d.forAuction : d.forFixedPrice
            }["N3EbayCSVExportModal.N3EbayCSVExportModal.useMemo[availableDurations]"]);
        }
    }["N3EbayCSVExportModal.N3EbayCSVExportModal.useMemo[availableDurations]"], [
        options.format
    ]);
    // 初期値設定
    __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "N3EbayCSVExportModal.N3EbayCSVExportModal.useEffect": ()=>{
            if (isOpen) {
                setOptions({
                    "N3EbayCSVExportModal.N3EbayCSVExportModal.useEffect": (prev)=>({
                            ...prev,
                            account: detectedAccount || prev.account,
                            site: detectedSite || prev.site,
                            action: recommendedAction,
                            duration: options.format === 'Auction' ? '7' : 'GTC'
                        })
                }["N3EbayCSVExportModal.N3EbayCSVExportModal.useEffect"]);
            }
        }
    }["N3EbayCSVExportModal.N3EbayCSVExportModal.useEffect"], [
        isOpen,
        detectedAccount,
        detectedSite,
        recommendedAction
    ]);
    // フォーマット変更時にDurationを調整
    __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "N3EbayCSVExportModal.N3EbayCSVExportModal.useEffect": ()=>{
            if (options.format === 'Auction' && options.duration === 'GTC') {
                setOptions({
                    "N3EbayCSVExportModal.N3EbayCSVExportModal.useEffect": (prev)=>({
                            ...prev,
                            duration: '7'
                        })
                }["N3EbayCSVExportModal.N3EbayCSVExportModal.useEffect"]);
            } else if (options.format === 'FixedPrice' && [
                '1',
                '3',
                '5',
                '7',
                '10'
            ].includes(options.duration)) {
                setOptions({
                    "N3EbayCSVExportModal.N3EbayCSVExportModal.useEffect": (prev)=>({
                            ...prev,
                            duration: 'GTC'
                        })
                }["N3EbayCSVExportModal.N3EbayCSVExportModal.useEffect"]);
            }
        }
    }["N3EbayCSVExportModal.N3EbayCSVExportModal.useEffect"], [
        options.format
    ]);
    // ハンドラー
    const handleOptionChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3EbayCSVExportModal.N3EbayCSVExportModal.useCallback[handleOptionChange]": (key, value)=>{
            setOptions({
                "N3EbayCSVExportModal.N3EbayCSVExportModal.useCallback[handleOptionChange]": (prev)=>({
                        ...prev,
                        [key]: value
                    })
            }["N3EbayCSVExportModal.N3EbayCSVExportModal.useCallback[handleOptionChange]"]);
            setError(null);
        }
    }["N3EbayCSVExportModal.N3EbayCSVExportModal.useCallback[handleOptionChange]"], []);
    const handleExport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3EbayCSVExportModal.N3EbayCSVExportModal.useCallback[handleExport]": async ()=>{
            if (selectedProducts.length === 0) {
                setError('エクスポートする商品を選択してください');
                return;
            }
            // Revise/Relistの場合、ItemID必須チェック
            if ((options.action === 'Revise' || options.action === 'Relist') && !hasExistingItemIds) {
                setError("".concat(options.action, "アクションにはItemIDが必要です。新規出品の場合はAddを選択してください。"));
                return;
            }
            setIsExporting(true);
            setError(null);
            try {
                await onExport(options);
                onClose();
            } catch (err) {
                setError(err.message || 'エクスポートに失敗しました');
            } finally{
                setIsExporting(false);
            }
        }
    }["N3EbayCSVExportModal.N3EbayCSVExportModal.useCallback[handleExport]"], [
        selectedProducts,
        options,
        hasExistingItemIds,
        onExport,
        onClose
    ]);
    // カテゴリ情報表示
    const categoryInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "N3EbayCSVExportModal.N3EbayCSVExportModal.useMemo[categoryInfo]": ()=>{
            const entries = Array.from(categoryStats.entries());
            if (entries.length === 0) return null;
            if (entries.length === 1) {
                const [key, count] = entries[0];
                const [catId, catName] = key.split('|');
                return {
                    single: true,
                    catId,
                    catName,
                    count
                };
            }
            return {
                single: false,
                categories: entries
            };
        }
    }["N3EbayCSVExportModal.N3EbayCSVExportModal.useMemo[categoryInfo]"], [
        categoryStats
    ]);
    if (!isOpen) return null;
    const currentSite = SITE_OPTIONS.find((s)=>s.value === options.site);
    const currentAccount = ACCOUNT_OPTIONS.find((a)=>a.value === options.account);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SimpleModal, {
        isOpen: isOpen,
        onClose: onClose,
        title: "eBay CSV エクスポート",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '16px',
                maxHeight: '70vh',
                overflowY: 'auto'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        background: 'linear-gradient(135deg, rgba(0, 100, 210, 0.1), rgba(0, 100, 210, 0.05))',
                        borderRadius: '8px',
                        marginBottom: '16px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                            size: 24,
                            style: {
                                color: '#0064d2'
                            }
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                            lineNumber: 303,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                flex: 1
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: 'var(--text)'
                                    },
                                    children: "eBay File Exchange / Seller Hub Reports 形式"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                    lineNumber: 305,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        fontSize: '12px',
                                        color: 'var(--text-muted)'
                                    },
                                    children: [
                                        "選択商品: ",
                                        selectedProducts.length,
                                        "件",
                                        hasExistingItemIds && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                marginLeft: '8px',
                                                color: '#f59e0b'
                                            },
                                            children: "⚠️ ItemID保有商品あり"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                            lineNumber: 311,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                    lineNumber: 308,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                            lineNumber: 304,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                    lineNumber: 294,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '6px',
                        marginBottom: '16px',
                        color: 'rgb(239, 68, 68)',
                        fontSize: '13px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                            size: 16
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                            lineNumber: 333,
                            columnNumber: 13
                        }, this),
                        error
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                    lineNumber: 321,
                    columnNumber: 11
                }, this),
                categoryInfo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: '12px',
                        background: 'var(--panel)',
                        border: '1px solid var(--panel-border)',
                        borderRadius: '6px',
                        marginBottom: '16px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: '11px',
                                fontWeight: 600,
                                color: 'var(--text-muted)',
                                marginBottom: '8px'
                            },
                            children: "📦 カテゴリ情報"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                            lineNumber: 347,
                            columnNumber: 13
                        }, this),
                        categoryInfo.single ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: '12px',
                                color: 'var(--text)'
                            },
                            children: [
                                categoryInfo.catName,
                                " (",
                                categoryInfo.catId,
                                ") - ",
                                categoryInfo.count,
                                "件"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                            lineNumber: 351,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: '12px',
                                color: 'var(--text)'
                            },
                            children: [
                                categoryInfo.categories.length,
                                "カテゴリに分散",
                                options.groupByCategory && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        color: '#22c55e',
                                        marginLeft: '8px'
                                    },
                                    children: "→ カテゴリ別にCSV分割"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                    lineNumber: 358,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                            lineNumber: 355,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                    lineNumber: 340,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px',
                        marginBottom: '16px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: {
                                        display: 'block',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        color: 'var(--text-muted)',
                                        marginBottom: '6px'
                                    },
                                    children: "アクション *"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                    lineNumber: 371,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '4px'
                                    },
                                    children: ACTION_OPTIONS.map((opt)=>{
                                        const Icon = opt.icon;
                                        const isRecommended = opt.value === recommendedAction;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleOptionChange('action', opt.value),
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '8px 12px',
                                                background: options.action === opt.value ? 'rgba(0, 100, 210, 0.1)' : 'transparent',
                                                border: '1px solid',
                                                borderColor: options.action === opt.value ? '#0064d2' : 'var(--panel-border)',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                textAlign: 'left'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                    size: 14,
                                                    style: {
                                                        color: options.action === opt.value ? '#0064d2' : 'var(--text-muted)'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                                    lineNumber: 395,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        flex: 1
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontSize: '12px',
                                                                fontWeight: 500,
                                                                color: 'var(--text)'
                                                            },
                                                            children: [
                                                                opt.label,
                                                                isRecommended && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        marginLeft: '6px',
                                                                        fontSize: '10px',
                                                                        color: '#22c55e'
                                                                    },
                                                                    children: "推奨"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                                                    lineNumber: 400,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                                            lineNumber: 397,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                fontSize: '10px',
                                                                color: 'var(--text-muted)'
                                                            },
                                                            children: opt.description
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                                            lineNumber: 403,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                                    lineNumber: 396,
                                                    columnNumber: 21
                                                }, this),
                                                options.action === opt.value && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                    size: 14,
                                                    style: {
                                                        color: '#0064d2'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                                    lineNumber: 405,
                                                    columnNumber: 54
                                                }, this)
                                            ]
                                        }, opt.value, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                            lineNumber: 379,
                                            columnNumber: 19
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                    lineNumber: 374,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                            lineNumber: 370,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: {
                                                display: 'block',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                color: 'var(--text-muted)',
                                                marginBottom: '6px'
                                            },
                                            children: "出品形式 *"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                            lineNumber: 416,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                gap: '8px'
                                            },
                                            children: FORMAT_OPTIONS.map((opt)=>{
                                                const Icon = opt.icon;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleOptionChange('format', opt.value),
                                                    style: {
                                                        flex: 1,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '6px',
                                                        padding: '10px',
                                                        background: options.format === opt.value ? 'rgba(0, 100, 210, 0.1)' : 'transparent',
                                                        border: '1px solid',
                                                        borderColor: options.format === opt.value ? '#0064d2' : 'var(--panel-border)',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                            size: 14,
                                                            style: {
                                                                color: options.format === opt.value ? '#0064d2' : 'var(--text-muted)'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                                            lineNumber: 440,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: '12px',
                                                                fontWeight: 500,
                                                                color: 'var(--text)'
                                                            },
                                                            children: opt.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                                            lineNumber: 441,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, opt.value, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                                    lineNumber: 423,
                                                    columnNumber: 21
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                            lineNumber: 419,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                    lineNumber: 415,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: {
                                                display: 'block',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                color: 'var(--text-muted)',
                                                marginBottom: '6px'
                                            },
                                            children: "出品サイト *"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                            lineNumber: 450,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(4, 1fr)',
                                                gap: '6px'
                                            },
                                            children: SITE_OPTIONS.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleOptionChange('site', opt.value),
                                                    style: {
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        gap: '2px',
                                                        padding: '8px 4px',
                                                        background: options.site === opt.value ? 'rgba(0, 100, 210, 0.1)' : 'transparent',
                                                        border: '1px solid',
                                                        borderColor: options.site === opt.value ? '#0064d2' : 'var(--panel-border)',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: '16px'
                                                            },
                                                            children: opt.flag
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                                            lineNumber: 471,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: '10px',
                                                                fontWeight: 500,
                                                                color: 'var(--text)'
                                                            },
                                                            children: opt.value
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                                            lineNumber: 472,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: '9px',
                                                                color: 'var(--text-muted)'
                                                            },
                                                            children: opt.currency
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                                            lineNumber: 473,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, opt.value, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                                    lineNumber: 455,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                            lineNumber: 453,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                    lineNumber: 449,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: {
                                                display: 'block',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                color: 'var(--text-muted)',
                                                marginBottom: '6px'
                                            },
                                            children: "アカウント *"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                            lineNumber: 481,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                gap: '8px'
                                            },
                                            children: ACCOUNT_OPTIONS.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleOptionChange('account', opt.value),
                                                    style: {
                                                        flex: 1,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '6px',
                                                        padding: '10px',
                                                        background: options.account === opt.value ? "".concat(opt.color, "15") : 'transparent',
                                                        border: '1px solid',
                                                        borderColor: options.account === opt.value ? opt.color : 'var(--panel-border)',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                                            size: 14,
                                                            style: {
                                                                color: options.account === opt.value ? opt.color : 'var(--text-muted)'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                                            lineNumber: 503,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: '13px',
                                                                fontWeight: 600,
                                                                color: options.account === opt.value ? opt.color : 'var(--text)'
                                                            },
                                                            children: opt.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                                            lineNumber: 504,
                                                            columnNumber: 21
                                                        }, this),
                                                        detectedAccount === opt.value && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: '9px',
                                                                color: '#22c55e'
                                                            },
                                                            children: "検出"
                                                        }, void 0, false, {
                                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                                            lineNumber: 512,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, opt.value, true, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                                    lineNumber: 486,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                            lineNumber: 484,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                    lineNumber: 480,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: {
                                                display: 'block',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                color: 'var(--text-muted)',
                                                marginBottom: '6px'
                                            },
                                            children: "出品期間"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                            lineNumber: 521,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: options.duration,
                                            onChange: (e)=>handleOptionChange('duration', e.target.value),
                                            style: {
                                                width: '100%',
                                                height: '36px',
                                                padding: '0 12px',
                                                fontSize: '12px',
                                                border: '1px solid var(--panel-border)',
                                                borderRadius: '6px',
                                                background: 'var(--panel)',
                                                color: 'var(--text)'
                                            },
                                            children: availableDurations.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: d.value,
                                                    children: d.label
                                                }, d.value, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                                    lineNumber: 539,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                            lineNumber: 524,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                    lineNumber: 520,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                            lineNumber: 413,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                    lineNumber: 368,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: '12px',
                        background: 'var(--panel)',
                        border: '1px solid var(--panel-border)',
                        borderRadius: '6px',
                        marginBottom: '16px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: '11px',
                                fontWeight: 600,
                                color: 'var(--text-muted)',
                                marginBottom: '10px'
                            },
                            children: "エクスポートオプション"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                            lineNumber: 554,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '8px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        cursor: 'pointer'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: options.includeItemSpecifics,
                                            onChange: (e)=>handleOptionChange('includeItemSpecifics', e.target.checked),
                                            style: {
                                                width: '16px',
                                                height: '16px'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                            lineNumber: 559,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: '12px',
                                                color: 'var(--text)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"], {
                                                    size: 12,
                                                    style: {
                                                        marginRight: '4px',
                                                        verticalAlign: 'middle'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                                    lineNumber: 566,
                                                    columnNumber: 17
                                                }, this),
                                                "Item Specifics (C:Brand等)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                            lineNumber: 565,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                    lineNumber: 558,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        cursor: 'pointer'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: options.includeHtml,
                                            onChange: (e)=>handleOptionChange('includeHtml', e.target.checked),
                                            style: {
                                                width: '16px',
                                                height: '16px'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                            lineNumber: 571,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: '12px',
                                                color: 'var(--text)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                    size: 12,
                                                    style: {
                                                        marginRight: '4px',
                                                        verticalAlign: 'middle'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                                    lineNumber: 578,
                                                    columnNumber: 17
                                                }, this),
                                                "HTML説明文を含める"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                            lineNumber: 577,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                    lineNumber: 570,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        cursor: 'pointer'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: options.includeBusinessPolicies,
                                            onChange: (e)=>handleOptionChange('includeBusinessPolicies', e.target.checked),
                                            style: {
                                                width: '16px',
                                                height: '16px'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                            lineNumber: 583,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: '12px',
                                                color: 'var(--text)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__["Settings2"], {
                                                    size: 12,
                                                    style: {
                                                        marginRight: '4px',
                                                        verticalAlign: 'middle'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                                    lineNumber: 590,
                                                    columnNumber: 17
                                                }, this),
                                                "ビジネスポリシーID"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                            lineNumber: 589,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                    lineNumber: 582,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    style: {
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        cursor: 'pointer'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: options.groupByCategory,
                                            onChange: (e)=>handleOptionChange('groupByCategory', e.target.checked),
                                            style: {
                                                width: '16px',
                                                height: '16px'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                            lineNumber: 595,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                fontSize: '12px',
                                                color: 'var(--text)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                                    size: 12,
                                                    style: {
                                                        marginRight: '4px',
                                                        verticalAlign: 'middle'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                                    lineNumber: 602,
                                                    columnNumber: 17
                                                }, this),
                                                "カテゴリ別にCSV分割"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                            lineNumber: 601,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                    lineNumber: 594,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                            lineNumber: 557,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                    lineNumber: 547,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        marginBottom: '16px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowAdvanced(!showAdvanced),
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 12px',
                                background: 'transparent',
                                border: '1px solid var(--panel-border)',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                width: '100%',
                                justifyContent: 'space-between'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        fontSize: '12px',
                                        color: 'var(--text-muted)'
                                    },
                                    children: "詳細オプション"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                    lineNumber: 626,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                    size: 14,
                                    style: {
                                        transform: showAdvanced ? 'rotate(180deg)' : 'none',
                                        transition: 'transform 0.2s',
                                        color: 'var(--text-muted)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                    lineNumber: 627,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                            lineNumber: 611,
                            columnNumber: 11
                        }, this),
                        showAdvanced && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: '12px',
                                border: '1px solid var(--panel-border)',
                                borderTop: 'none',
                                borderRadius: '0 0 6px 6px',
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '12px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: {
                                                display: 'block',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                color: 'var(--text-muted)',
                                                marginBottom: '4px'
                                            },
                                            children: "在庫数を上書き（空白で元データ使用）"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                            lineNumber: 649,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            min: 1,
                                            placeholder: "例: 5",
                                            value: options.overrideQuantity || '',
                                            onChange: (e)=>handleOptionChange('overrideQuantity', e.target.value ? parseInt(e.target.value) : null),
                                            style: {
                                                width: '100%',
                                                height: '32px',
                                                padding: '0 10px',
                                                fontSize: '12px',
                                                border: '1px solid var(--panel-border)',
                                                borderRadius: '4px',
                                                background: 'var(--panel)',
                                                color: 'var(--text)'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                            lineNumber: 652,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                    lineNumber: 648,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            style: {
                                                display: 'block',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                color: 'var(--text-muted)',
                                                marginBottom: '4px'
                                            },
                                            children: "出品予約時間（空白で即時）"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                            lineNumber: 673,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "datetime-local",
                                            value: options.scheduleTime || '',
                                            onChange: (e)=>handleOptionChange('scheduleTime', e.target.value || null),
                                            style: {
                                                width: '100%',
                                                height: '32px',
                                                padding: '0 10px',
                                                fontSize: '12px',
                                                border: '1px solid var(--panel-border)',
                                                borderRadius: '4px',
                                                background: 'var(--panel)',
                                                color: 'var(--text)'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                            lineNumber: 676,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                    lineNumber: 672,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                            lineNumber: 638,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                    lineNumber: 610,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: '12px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        borderRadius: '6px',
                        marginBottom: '16px'
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                size: 14,
                                style: {
                                    color: '#3b82f6',
                                    marginTop: '2px'
                                }
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                lineNumber: 705,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: '11px',
                                    color: 'var(--text-muted)',
                                    lineHeight: 1.5
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                        children: "CSV仕様:"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                        lineNumber: 707,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                        lineNumber: 707,
                                        columnNumber: 38
                                    }, this),
                                    "• カラム: Action, ItemID, CustomLabel(SKU), *Title, *Category, *ConditionID, *Format, *Duration, *StartPrice, *Quantity, Description, PicURL, C:Brand, C:MPN...",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                        lineNumber: 708,
                                        columnNumber: 171
                                    }, this),
                                    "• 画像は最大12枚、| (パイプ) で区切り",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                        lineNumber: 709,
                                        columnNumber: 38
                                    }, this),
                                    "• Item Specificsは C: プレフィックス（例: C:Brand, C:Type）",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                        lineNumber: 710,
                                        columnNumber: 63
                                    }, this),
                                    "• ビジネスポリシーはID指定: PolicyPayment, PolicyShipping, PolicyReturn"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                lineNumber: 706,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                        lineNumber: 704,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                    lineNumber: 697,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '8px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            disabled: isExporting,
                            style: {
                                padding: '10px 20px',
                                fontSize: '13px',
                                fontWeight: 500,
                                background: 'transparent',
                                border: '1px solid var(--panel-border)',
                                borderRadius: '6px',
                                color: 'var(--text)',
                                cursor: 'pointer'
                            },
                            children: "キャンセル"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                            lineNumber: 718,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleExport,
                            disabled: isExporting || selectedProducts.length === 0,
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 24px',
                                fontSize: '13px',
                                fontWeight: 600,
                                background: isExporting ? '#0064d280' : '#0064d2',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                cursor: isExporting ? 'not-allowed' : 'pointer'
                            },
                            children: isExporting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        size: 16,
                                        className: "animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                        lineNumber: 753,
                                        columnNumber: 17
                                    }, this),
                                    "エクスポート中..."
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                        size: 16
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                                        lineNumber: 758,
                                        columnNumber: 17
                                    }, this),
                                    "CSVをダウンロード (",
                                    selectedProducts.length,
                                    "件)"
                                ]
                            }, void 0, true)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                            lineNumber: 734,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
                    lineNumber: 717,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
            lineNumber: 292,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx",
        lineNumber: 287,
        columnNumber: 5
    }, this);
}, "BI3V86daOQ2U159B4CiCZ6C+5yE=")), "BI3V86daOQ2U159B4CiCZ6C+5yE=");
_c2 = N3EbayCSVExportModal;
const __TURBOPACK__default__export__ = N3EbayCSVExportModal;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "SimpleModal");
__turbopack_context__.k.register(_c1, "N3EbayCSVExportModal$memo");
__turbopack_context__.k.register(_c2, "N3EbayCSVExportModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx
/**
 * SKU編集モーダル
 * 
 * eBay出品時の「重複エラー」回避用
 * - SKUを手動で変更可能
 * - 新しいSKUを自動生成するオプション
 */ __turbopack_context__.s([
    "N3SKUEditModal",
    ()=>N3SKUEditModal,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/copy.js [app-client] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/node_modules/lucide-react/dist/esm/icons/pen-line.js [app-client] (ecmascript) <export default as Edit3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/components/n3/presentational/n3-button.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function N3SKUEditModal(param) {
    let { isOpen, onClose, productId, currentSku, productTitle, errorMessage, onSave, onRetryListing } = param;
    _s();
    const [newSku, setNewSku] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(currentSku);
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // モーダルが開かれたときにSKUをリセット
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "N3SKUEditModal.useEffect": ()=>{
            if (isOpen) {
                setNewSku(currentSku);
                setError(null);
                setSuccess(false);
            }
        }
    }["N3SKUEditModal.useEffect"], [
        isOpen,
        currentSku
    ]);
    // SKU自動生成
    const generateNewSku = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3SKUEditModal.useCallback[generateNewSku]": ()=>{
            const timestamp = Date.now().toString(36).toUpperCase();
            const random = Math.random().toString(36).substring(2, 6).toUpperCase();
            const baseSku = currentSku.replace(/-v\d+$/, '').replace(/-\d+$/, '');
            const newGeneratedSku = "".concat(baseSku, "-").concat(timestamp).concat(random);
            setNewSku(newGeneratedSku);
        }
    }["N3SKUEditModal.useCallback[generateNewSku]"], [
        currentSku
    ]);
    // バージョン追加（シンプル）
    const addVersion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3SKUEditModal.useCallback[addVersion]": ()=>{
            const baseSku = currentSku.replace(/-v\d+$/, '');
            const match = currentSku.match(/-v(\d+)$/);
            const version = match ? parseInt(match[1]) + 1 : 2;
            setNewSku("".concat(baseSku, "-v").concat(version));
        }
    }["N3SKUEditModal.useCallback[addVersion]"], [
        currentSku
    ]);
    // SKUをコピー
    const copySku = (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "N3SKUEditModal.useCallback[copySku]": ()=>{
            navigator.clipboard.writeText(newSku);
            setCopied(true);
            setTimeout({
                "N3SKUEditModal.useCallback[copySku]": ()=>setCopied(false)
            }["N3SKUEditModal.useCallback[copySku]"], 2000);
        }
    }["N3SKUEditModal.useCallback[copySku]"], [
        newSku
    ]);
    // 保存処理
    const handleSave = async ()=>{
        if (newSku === currentSku) {
            setError('SKUが変更されていません');
            return;
        }
        if (!newSku.trim()) {
            setError('SKUを入力してください');
            return;
        }
        // SKUバリデーション（eBayの制限: 英数字、ハイフン、アンダースコアのみ、50文字以内）
        if (!/^[A-Za-z0-9_-]+$/.test(newSku)) {
            setError('SKUは英数字、ハイフン(-)、アンダースコア(_)のみ使用可能です');
            return;
        }
        if (newSku.length > 50) {
            setError('SKUは50文字以内にしてください');
            return;
        }
        setIsSaving(true);
        setError(null);
        try {
            const result = await onSave(newSku);
            if (result.success) {
                setSuccess(true);
                // 成功後、3秒で自動閉じる
                setTimeout(()=>{
                    onClose();
                    if (onRetryListing) {
                        onRetryListing();
                    }
                }, 1500);
            } else {
                setError(result.error || 'SKUの更新に失敗しました');
            }
        } catch (e) {
            setError(e.message || '予期しないエラーが発生しました');
        } finally{
            setIsSaving(false);
        }
    };
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[9999] flex items-center justify-center",
        style: {
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "rounded-lg shadow-2xl w-full max-w-md overflow-hidden",
            style: {
                background: 'var(--panel)',
                border: '1px solid var(--panel-border)'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between px-5 py-4",
                    style: {
                        borderBottom: '1px solid var(--panel-border)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pen$2d$line$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit3$3e$__["Edit3"], {
                                    size: 20,
                                    style: {
                                        color: 'var(--accent)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                                    lineNumber: 140,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-semibold",
                                    style: {
                                        color: 'var(--text)'
                                    },
                                    children: "SKU編集"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                                    lineNumber: 141,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                            lineNumber: 139,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "p-1 rounded hover:bg-white/10 transition-colors",
                            style: {
                                color: 'var(--text-muted)'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                                lineNumber: 150,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                            lineNumber: 145,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                    lineNumber: 135,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-5 py-4 space-y-4",
                    children: [
                        errorMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-3 rounded-lg flex items-start gap-3",
                            style: {
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.3)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                    size: 18,
                                    className: "flex-shrink-0 mt-0.5",
                                    style: {
                                        color: '#ef4444'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                                    lineNumber: 162,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm font-medium",
                                            style: {
                                                color: '#ef4444'
                                            },
                                            children: "出品エラー"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                                            lineNumber: 164,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs mt-1",
                                            style: {
                                                color: 'var(--text-muted)'
                                            },
                                            children: errorMessage
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                                            lineNumber: 167,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                                    lineNumber: 163,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                            lineNumber: 158,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-3 rounded-lg",
                            style: {
                                background: 'var(--highlight)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs",
                                    style: {
                                        color: 'var(--text-muted)'
                                    },
                                    children: "商品名"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                                    lineNumber: 179,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm font-medium truncate",
                                    style: {
                                        color: 'var(--text)'
                                    },
                                    children: productTitle || "商品ID: ".concat(productId)
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                                    lineNumber: 182,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                            lineNumber: 175,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-xs font-semibold",
                                    style: {
                                        color: 'var(--text-muted)'
                                    },
                                    children: "現在のSKU"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                                    lineNumber: 189,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-1 px-3 py-2 rounded-lg text-sm font-mono",
                                    style: {
                                        background: 'var(--highlight)',
                                        color: 'var(--text-muted)'
                                    },
                                    children: currentSku
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                                    lineNumber: 192,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                            lineNumber: 188,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "text-xs font-semibold",
                                    style: {
                                        color: 'var(--text-muted)'
                                    },
                                    children: "新しいSKU"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                                    lineNumber: 202,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-1 flex gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: newSku,
                                            onChange: (e)=>setNewSku(e.target.value.toUpperCase()),
                                            className: "flex-1 px-3 py-2 rounded-lg text-sm font-mono",
                                            style: {
                                                background: 'var(--highlight)',
                                                border: '1px solid var(--panel-border)',
                                                color: 'var(--text)'
                                            },
                                            placeholder: "新しいSKUを入力"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                                            lineNumber: 206,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: copySku,
                                            className: "p-2 rounded-lg transition-colors",
                                            style: {
                                                background: 'var(--highlight)',
                                                color: 'var(--text-muted)'
                                            },
                                            title: "コピー",
                                            children: copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                                                lineNumber: 224,
                                                columnNumber: 27
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                                                lineNumber: 224,
                                                columnNumber: 49
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                                            lineNumber: 218,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                                    lineNumber: 205,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                            lineNumber: 201,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: addVersion,
                                    className: "flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                                    style: {
                                        background: 'var(--highlight)',
                                        color: 'var(--text)'
                                    },
                                    children: "バージョン追加 (-v2)"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                                    lineNumber: 231,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: generateNewSku,
                                    className: "flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1",
                                    style: {
                                        background: 'var(--highlight)',
                                        color: 'var(--text)'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                            size: 12
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                                            lineNumber: 243,
                                            columnNumber: 15
                                        }, this),
                                        "自動生成"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                                    lineNumber: 238,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                            lineNumber: 230,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-3 rounded-lg text-xs",
                            style: {
                                background: 'rgba(59, 130, 246, 0.1)',
                                color: 'var(--text-muted)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mb-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "ヒント:"
                                        }, void 0, false, {
                                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                                            lineNumber: 254,
                                            columnNumber: 15
                                        }, this),
                                        " eBayでは、同じSKUで複数の出品予約（Offer）が作成できません。"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                                    lineNumber: 253,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "SKUを変更することで、新しい出品として処理されます。"
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                                    lineNumber: 256,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                            lineNumber: 249,
                            columnNumber: 11
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-3 rounded-lg text-sm",
                            style: {
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: '#ef4444'
                            },
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                            lineNumber: 263,
                            columnNumber: 13
                        }, this),
                        success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-3 rounded-lg text-sm flex items-center gap-2",
                            style: {
                                background: 'rgba(34, 197, 94, 0.1)',
                                color: '#22c55e'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                    size: 16
                                }, void 0, false, {
                                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                                    lineNumber: 277,
                                    columnNumber: 15
                                }, this),
                                "SKUを更新しました。再出品を試みます..."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                            lineNumber: 273,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                    lineNumber: 155,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-end gap-2 px-5 py-4",
                    style: {
                        borderTop: '1px solid var(--panel-border)',
                        background: 'var(--highlight)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                            variant: "secondary",
                            onClick: onClose,
                            disabled: isSaving,
                            children: "キャンセル"
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                            lineNumber: 288,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$components$2f$n3$2f$presentational$2f$n3$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["N3Button"], {
                            variant: "primary",
                            onClick: handleSave,
                            disabled: isSaving || newSku === currentSku || success,
                            children: isSaving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                                    }, void 0, false, {
                                        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                                        lineNumber: 298,
                                        columnNumber: 17
                                    }, this),
                                    "保存中..."
                                ]
                            }, void 0, true) : '保存して再出品'
                        }, void 0, false, {
                            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                            lineNumber: 291,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
                    lineNumber: 284,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
            lineNumber: 130,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx",
        lineNumber: 126,
        columnNumber: 5
    }, this);
}
_s(N3SKUEditModal, "Cw+FZnH4ac0rOmP3cpf/L25SkmQ=");
_c = N3SKUEditModal;
const __TURBOPACK__default__export__ = N3SKUEditModal;
var _c;
__turbopack_context__.k.register(_c, "N3SKUEditModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// app/tools/editing-n3/components/modals/index.ts
/**
 * N3モーダルコンポーネントのエクスポート
 */ __turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$modals$2f$n3$2d$bulk$2d$image$2d$upload$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$modals$2f$n3$2d$image$2d$attach$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$modals$2f$n3$2d$inventory$2d$detail$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$modals$2f$n3$2d$new$2d$product$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-new-product-modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$modals$2f$n3$2d$listing$2d$destination$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-listing-destination-modal.tsx [app-client] (ecmascript)");
// N3 v3.1 セット品構成管理モーダル
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$modals$2f$n3$2d$bundle$2d$composition$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx [app-client] (ecmascript)");
// N3 eBay CSV Export モーダル
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$modals$2f$n3$2d$ebay$2d$csv$2d$export$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-ebay-csv-export-modal.tsx [app-client] (ecmascript)");
// N3 SKU編集モーダル（重複出品エラー対応）
var __TURBOPACK__imported__module__$5b$project$5d2f$n3$2d$frontend_vps$2f$app$2f$tools$2f$editing$2d$n3$2f$components$2f$modals$2f$n3$2d$sku$2d$edit$2d$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/n3-frontend_vps/app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=n3-frontend_vps_app_tools_editing-n3_components_modals_e81107a7._.js.map