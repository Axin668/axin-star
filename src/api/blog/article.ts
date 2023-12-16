import request from '@/utils/request'
import { ArticleQuery, UpdateArticleForm } from './types'
import { useManagerStoreHook } from '@/stores/modules/manager';

export function fetchArticleList(query: ArticleQuery) {
    return request({
        url: '/api-blog/articles',
        method: 'get',
        params: query
    })
}

export function fetchArticle(id: number) {
    return request({
        url: '/api-blog/articles/' + id,
        method: 'get'
    })
}

// 初次加载必须同步执行
export function fetchArticleAsync(id: number) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', import.meta.env.VITE_APP_BASE_API + '/api-blog/articles/' + id, false);
    const token = useManagerStoreHook().token;
    // let each request carry token
    // ['X-Token'] is a custom headers key
    // please modify it according to the actual situation
    if (token) {
        xhr.setRequestHeader('X-Token', token);
    }
    xhr.send()
    return xhr;
}

export function deleteArticle(id: number) {
    return request({
        url: '/api-blog/articles/' + id,
        method: 'delete'
    })
}

export function fetchInfo() {
    return request({
        url: '/api-blog/info',
        method: 'get'
    })
}

export function updateArticle(data: UpdateArticleForm) {
    return request({
        url: '/api-blog/articles',
        method: 'put',
        data
    })
}

export function updateArticlePublish(id: number) {
    return request({
        url: '/api-blog/articles/publish/' + id,
        method: 'put'
    })
}

export function cancelPublish(id: number) {
    return request({
        url: '/api-blog/articles/cancelPublish/' + id,
        method: 'put'
    })
}

export function createArticle(data: UpdateArticleForm) {
    return request({
        url: '/api-blog/articles',
        method: 'post',
        data
    })
}

export function addUpdateAndPublish(data: UpdateArticleForm) {
    return request({
        url: '/api-blog/articles/addUpdateAndPublish',
        method: 'post',
        data
    })
}