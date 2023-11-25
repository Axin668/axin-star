import { ElMessageBox, ElMessage } from 'element-plus'
import { HandleData } from './interface'

/**
 * @description 操作单条数据信息 (二次确认【删除、禁用、启用、重置密码】)
 * @param {Function} api 操作数据接口的api方法 (必传)
 * @param {Object} params 携带的操作数据参数 {id,params} (必传)
 * @param {String} message 提示信息 (必传)
 * @param {String} confirmType icon类型 (不必传,默认为 warning)
 * @returns {Promise}
 */
export const useHandleData = (
  api: (params: any) => Promise<any>,
  // 一般删除传id或者ids就可以了
  params: any = {},
  message: string,
  confirmType: HandleData.MessageType = 'warning'
) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(`确认${message}???`, '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: confirmType,
      draggable: true
    }).then(async () => {
      // 对应删除(number)和批量(string)删除
      const { id, ids } = params
      const effectiveId = id || ids
      const res = await api(effectiveId)
      if (!res) return reject(false)
      ElMessage({
        type: 'success',
        message: `${message}成功!`
      })
      resolve(true)
    })
  })
}
