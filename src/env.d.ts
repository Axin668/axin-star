//解决.vue类型声明问题
declare module '*.vue' {
    import type { DefineComponent } from "vue";
    const vueComponent: DefineComponent<{}, {}, any>
    export default vueComponent
}