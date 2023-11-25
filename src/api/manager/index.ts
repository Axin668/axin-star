import request from '@/utils/request'
import { AxiosPromise } from 'axios'
import { ManagerForm, ManagerInfo, ManagerPageVO, ManagerQuery } from './types'

/**
 * 登录成功后获取用户信息（昵称、头像、权限集合和角色集合）
 */
export function getManagerInfo(): AxiosPromise<ManagerInfo> {
  return request({
    url: '/api/managers/me',
    method: 'get'
  })
}

/**
 * 获取管理员分页列表
 * 
 * @param queryParams 
 */
export function getManagerPage(
  queryParams: ManagerQuery
): AxiosPromise<global.PageResult<ManagerPageVO[]>> {
  return request({
    url: "/api/managers/page",
    method: "get",
    params: queryParams
  })
}

/**
 * 获取管理员表单详情
 * 
 * @param managerId 
 */
export function getManagerForm(managerId: number): AxiosPromise<ManagerForm> {
  return request({
    url: "/api/managers/" + managerId + "/form",
    method: "get",
  });
}

/**
 * 添加管理员
 * 
 * @param data 
 */
export function addManager(data: any) {
  return request({
    url: "/api/managers",
    method: "post",
    data: data
  });
}

/**
 * 修改管理员信息
 * 
 * @param id 
 * @param data 
 */
export function updateManager(id: number, data: ManagerForm) {
  return request({
    url: "/api/managers/" + id,
    method: "put",
    data: data,
  });
}

/**
 * 修改管理员状态
 * 
 * @param id 
 * @param status 
 */
export function updateManagerStatus(id: number, status: number) {
  return request({
    url: "/api/managers/" + id + "/status",
    method: "patch",
    params: { status: status }
  });
}

/**
 * 修改管理员密码
 * 
 * @param id 
 * @param password 
 */
export function updateManagerPassword(id: number, password: string) {
  return request({
    url: "/api/managers/" + id + "/password",
    method: "patch",
    params: { password: password },
  });
}

/**
 * 批量删除管理员
 * 
 * @param ids 
 */
export function deleteManagers(ids: string) {
  return request({
    url: "/api/managers/" + ids,
    method: "delete",
  });
}

/**
 * 下载管理员导入模板
 * 
 * @returns
 */
export function downloadTemplateApi() {
  return request({
    url: "/api/managers/template",
    method: "get",
    responseType: "arraybuffer",
  });
}

/**
 * 导出管理员
 * 
 * @param queryParams 
 * @returns 
 */
export function exportManager(queryParams: ManagerQuery) {
  return request({
    url: "/api/managers/_export",
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}

/**
 * 导入管理员
 * 
 * @param deptId 
 * @param file 
 * @returns 
 */
export function importManager(deptId: number, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/managers/_import",
    method: "post",
    params: { deptId: deptId },
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
}