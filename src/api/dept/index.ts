import request from "@/utils/request"
import { AxiosPromise } from "axios";
import { DeptForm, DeptQuery, DeptVO } from "./types";

/**
 * 部门树形表格
 * 
 * @param queryParams 
 * @returns 
 */
export function listDepts(queryParams?: DeptQuery): AxiosPromise<DeptVO[]> {
    return request({
        url: "/api/dept",
        method: "get",
        params: queryParams,
    });
}

/**
 * 部门下拉列表
 * 
 * @returns 
 */
export function listDeptOptions(): AxiosPromise<[]> {
    return request({
        url: "/api/dept/options",
        method: "get",
    });
}

/**
 * 获取部门详情
 * 
 * @param id 
 * @returns 
 */
export function getDeptForm(id: number): AxiosPromise<DeptForm> {
    return request({
        url: "/api/dept/" + id + "/form",
        method: "get",
    });
}

/**
 * 新增部门
 * 
 * @param data 
 * @returns 
 */
export function addDept(data: DeptForm) {
    return request({
        url: "/api/dept",
        method: "post",
        data: data
    });
}

/**
 * 修改部门
 * 
 * @param id 
 * @param data 
 * @returns 
 */
export function updateDept(id: number, data: DeptForm) {
    return request({
        url: "/api/dept/" + id,
        method: "put",
        data: data
    });
}

/**
 * 删除部门
 * 
 * @param ids 
 * @returns 
 */
export function deleteDept(ids: string) {
    return request({
        url: "/api/dept/" + ids,
        method: "delete",
    });
}
