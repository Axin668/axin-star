interface ImportMetaEnv {
    /**
    * 应用标题
    */
    VITE_APP_TITLE: string;
    /**
    * 应用端口
    */
    VITE_APP_PORT: number;
    /**
    * API基础路径(反向代理)
    */
    VITE_APP_BASE_API: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

//解决.vue类型声明问题
declare module '*.vue' {
    import type { DefineComponent } from "vue";
    const vueComponent: DefineComponent<{}, {}, any>
    export default vueComponent
}