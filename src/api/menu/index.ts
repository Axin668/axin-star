import request from '@/utils/request'
import { MenuForm, MenuQuery, MenuVO } from './types'
import { AxiosPromise } from 'axios'

/**
 * 获取路由列表
 */
export function listRoutes() {
  return request({
    url: '/api/menus/routes',
    method: 'get'
  })
}

/**
 * 获取菜单树形列表
 */
export function listMenus(queryParams: MenuQuery): AxiosPromise<MenuVO[]> {
  return request({
    url: '/api/menus',
    method: 'get',
    params: queryParams
  })
}

/**
 * 获取菜单下拉树形列表
 */
export function listMenuOptions(): AxiosPromise<OptionType[]> {
  return request({
    url: '/api/menus/options',
    method: 'get'
  })
}

/**
 * 获取菜单表单数据
 *
 * @param id
 */
export function getMenuForm(id: number): AxiosPromise<MenuForm> {
  return request({
    url: '/api/menus/' + id + '/form',
    method: 'get'
  })
}

/**
 * 添加菜单
 *
 * @param data
 */
export function addMenu(data: MenuForm) {
  return request({
    // url: '/api/menus/add',
    url: '/api/menus',
    method: 'post',
    data: data
  })
}

/**
 * 修改菜单
 *
 * @param id
 * @param data
 */
export function updateMenu(id: string, data: MenuForm) {
  return request({
    // url: '/api/menus/update',
    url: '/api/menus/' + id,
    method: 'put',
    data: data
  })
}

/**
 * 删除菜单
 *
 * @param id
 */
export function deleteMenu(id: number) {
  return request({
    url: '/api/menus/' + id,
    method: 'delete'
  })
}

