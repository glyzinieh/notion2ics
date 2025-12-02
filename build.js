const { build } = require('esbuild');
const { GasPlugin } = require('esbuild-gas-plugin');

build({
    entryPoints: ['src/index.ts'], // エントリーポイント（メインファイル）
    bundle: true,
    outfile: 'dist/bundle.js',     // 出力先
    target: 'es2020',              // GAS (V8) はモダンなJSに対応しています
    plugins: [GasPlugin],          // これが重要：トップレベル関数をglobalに露出させる
}).catch(() => process.exit(1));
