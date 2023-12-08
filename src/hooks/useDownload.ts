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
        const blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
        });
        // 兼容 edge 不支持 createObjectURL 方法
        if ("msSaveOrOpenBlob" in navigator) return window.navigator.msSaveOrOpenBlob(blob, tempName + fileType);
        const exportFile = document.createElement("a");
        const blobUrl = window.URL.createObjectURL(blob); // 下载的链接
        exportFile.href = blobUrl;
        exportFile.style.display = "none";
        // exportFile.download = `${tempName}${fileType}`;
        exportFile.download = decodeURI(
            res.headers["content-disposition"].split(";")[1].split("=")[1]
        );  // 获取后台设置的文件名称
        document.body.appendChild(exportFile);
        exportFile.click();  // 点击导出
        // 去除下载对 url 的影响
        document.body.removeChild(exportFile);  // 下载完成移除元素
        window.URL.revokeObjectURL(blobUrl);  // 释放掉blob对象
    } catch (error) {
        console.log(error);
    }
}