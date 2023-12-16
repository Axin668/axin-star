import request from '@/utils/request'

export function upload(formData: any) {
    return request({
        url: '/api-blog/upload',
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        data: formData
    })
}

export function policy(title: string) {
    return request({
        url: '/api-blog/upload/policy',
        method: 'get',
        params: { title }
    })
}