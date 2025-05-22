import type { BuildConfig } from 'bun'
import dts from 'bun-plugin-dts'

const defaultBuildConfig: BuildConfig = {
  entrypoints: ['./src/index.ts'],
  outdir: './dist'
}

await Promise.all([
  Bun.build({
    ...defaultBuildConfig,
    plugins: [dts()],
    format: 'esm',
    target: "browser",
    naming: "[dir]/[name].mjs",
  }),
  Bun.build({
    ...defaultBuildConfig,
    entrypoints: ['./src/index.global.ts'],
    format: 'esm',
    target: "browser",
    naming: "[dir]/[name].js",
  }),
])
