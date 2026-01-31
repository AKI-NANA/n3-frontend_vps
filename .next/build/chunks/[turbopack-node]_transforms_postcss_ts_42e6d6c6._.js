module.exports = [
"[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/n3-frontend_vps/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "build/chunks/a58f5_e0cee373._.js",
  "build/chunks/[root-of-the-server]__bbf82c1d._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/n3-frontend_vps/postcss.config.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];