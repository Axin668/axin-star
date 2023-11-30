import { ElNotification } from "element-plus"

export const useDownload = async (
    api: (param: any) => Promise<any>,
    tempName: string,
    params: any = {},
    isNotify: boolean = true,
    fileType: string = ".xlsx"
) => {
    if (isNotify) {
        ElNotification({
            title: "温馨提示",
            message: "如果数据庞大会导致下载缓慢哦, 请您耐心等待",
            type: "info",
            duration: 3000
        });
    }
    try {
        const res = await api(params);
        const blob = new Blob([res]);
        // 兼容 edge 不支持 createObjectURL 方法
        if ("msSaveOrOpenBlob" in navigator) return window.navigator.msSaveOrOpenBlob(blob, tempName + fileType);
        const blobUrl = window.URL.createObjectURL(blob);
        const exportFile = document.createElement("a");
        exportFile.style.display = "none";
        exportFile.download = `${tempName}${fileType}`;
        exportFile.href = blobUrl;
        document.body.appendChild(exportFile);
        exportFile.click();
        // 去除下载对 url 的影响
        document.body.removeChild(exportFile);
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.log(error);
    }
}