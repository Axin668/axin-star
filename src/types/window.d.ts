import { ComponentInternalInstance } from "vue";

declare global {
  interface Navigator {
    msSaveOrOpenBlob: (blob: Blob, fileName: string) => void;
    browserLanguage: string;
  }

  /**
  * Window 属性扩展
  */
  interface Window {
    vue: ComponentInternalInstance | null
    vditor: Vditor | null
  }
}
  
export {};