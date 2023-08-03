import { UserConfig, ConfigEnv, loadEnv, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import UnoCSS from 'unocss/vite'

const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd())
  return {
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: `@use "@/styles/variables.scss" as *;`
        }
      }
    },
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', "@vueuse/core"],
        eslintrc: {
          enabled: false,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true
        },
        resolvers: [
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
          ElementPlusResolver(),
          // 自动导入图标组件
          IconsResolver({})
        ],
        vueTemplate: true, // 是否在 vue 模板中自动导入
        // dts: false,
        dts: path.resolve(pathSrc, "types", "auto-imports.d.ts") // 自动导入组件类型声明文件位置，默认根目录
      }),
      Components({
        resolvers: [
          ElementPlusResolver(),
          IconsResolver({
            enabledCollections: ["ep"]
          })
        ],
        dirs: ["src/**/components"],
        // dts: false,
        dts: path.resolve(pathSrc, "types", "components.d.ts") // 自动导入组件类型声明文件位置，默认根目录
      }),
      Icons({
        // 自动安装图标库
        autoInstall: true
      }),
      createSvgIconsPlugin({
        //指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        //指定SymbolId的格式
        symbolId: 'icon-[dir]-[name]'
      }),
      UnoCSS({ /* options */ }),
    ],
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_APP_PORT),
      open: true,
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: 'http://vapi.youlai.tech',
          changeOrigin: true,
          rewrite: path => 
            path.replace(new RegExp('^' + env.VITE_APP_BASE_API), '')
        }
      }
    },
    resolve: {
      alias: [
        {
          find: '@',
          replacement: pathSrc
        }
      ]
    }
  }
})