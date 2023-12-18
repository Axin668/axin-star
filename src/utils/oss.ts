import { policy } from "@/api/blog/file";
import OSS from "ali-oss";
import { ElMessage } from "element-plus";
import { v4 as uuidv4 } from 'uuid'

export const uploadImgObject = async (file: any, callback: any, title: string) => {
    // 文章名称 去除空格
    title = title.replaceAll(' ', '');
    // 上传 文件名(注意文件是数组, 取第一个即可)
    var filename = uuidv4().replace(/-/g, '') + '.' + file[0].type.split('/').pop();
    console.log(filename)
    // 上传相对于整个bucket (图床)路径名
    var ext = 'markdown/' + title + '/' + filename

    let res = await policy(title)
    if (!res.data) return ElMessage("credentials invalid")
    // 启动OSS客户端
    let stsConfig = res.data
    console.log(stsConfig)
    const ossStaticHost = stsConfig.ossStaticHost
    try {
        var client = new OSS({
            accessKeyId: stsConfig.accessKeyId,
            accessKeySecret: stsConfig.accessKeySecret,
            stsToken: stsConfig.securityToken,
            bucket: stsConfig.bucket,
            region: stsConfig.region
        })

        var filePath = ossStaticHost + '/markdown/' + title + '/' + filename
        if (file.size >= 10 * 1024 * 1024) { // 分片上传
            await client.multipartUpload(ext, file, {
                // 获取分片上传进度、断点和返回值
                progress: (p, cpt, res) => {
                    // onUploadProgress&&onUploadProgress(p)
                },
                // 设置并发上传的分片数量
                parallel: 4,
                // 设置分片大小 默认值为1 MB, 最小值为100KB
                partSize: 1024 * 1024,
                // headers,
                // 自定义元数据, 通过HeadObject接口可以获取Object的元数据
                mime: "text/plain",
                timeout: 120000
            });
            
            callback(filePath)
        } else {
            await client.put(ext, file[0])
            callback(filePath)
        }
        return ossStaticHost
    } catch (err) {
        console.log(err)
    }
}