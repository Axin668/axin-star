<template>
    <div class="table-box">
      <ProTable
        ref="proTable"
        :columns="columns"
        :request-api="getTableList"
        row-key="id"
        size="small"
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
          <!-- 表格 header 按钮 -->
          <template #tableHeader>
              <el-button  type="success" :icon="CirclePlus" @click="openDrawer()">新增</el-button>
              <el-button  type="danger" :icon="Delete" :disabled="ids.length === 0" @click="handleDelete()">删除</el-button>
          </template>
  
          <!-- 表格操作 -->
          <template #operation="scope">
              <el-button type="primary" size="small" link @click="openRoleMenuDialog(scope.row)"><i-ep-position /> 分配权限</el-button>
              <el-button type="primary" size="small" link @click="openDrawer(scope.row.id)"><i-ep-edit /> 编辑</el-button>
              <el-button type="primary" size="small" link @click="handleDelete(scope.row.id, scope.row.roleName)">删除</el-button>
          </template>
      </ProTable>
      <RoleDrawer ref="drawerRef" />
      <RoleMenuDialog ref="dialogRef" />
    </div>
  </template>
  
<script setup lang="tsx">
import { ColumnProps, ProTableInstance } from '@/components/ProTable/interface';
import { Delete, CirclePlus } from "@element-plus/icons-vue";
import { useHandleData } from '@/hooks/useHandleData';
import { ElMessage } from 'element-plus';
import { addRole, deleteRoles, getRoleForm, getRoleMenuIds, getRolePage, updateRole, updateRoleMenus } from '@/api/role';
import { RolePageVO } from '@/api/role/types';
import RoleDrawer from './components/RoleDrawer.vue';
import RoleMenuDialog from './components/RoleMenuDialog.vue';
import { listMenuOptions } from '@/api/menu';
  
defineOptions({
    name: "Role",
    inheritAttrs: false,
});

const proTable = ref<ProTableInstance>();
  
// 批量删除角色的ids
const ids = ref<number[]>([]);
  
/**
* 菜单查询
*/
const getTableList = (params: any) => {
    let newParams = JSON.parse(JSON.stringify(params))
    return getRolePage(newParams);
}
  
// 表格配置项
const columns = reactive<ColumnProps<RolePageVO>[]>([
    {
        prop: "keywords",
        label: "关键字",
        search: { el: "input", tooltip: "搜索提示: 目前支持[角色名称]以及[角色编码]关键字~"},
        isShow: false
    },
    {
        type: "selection",
        width: 55,
        align: "center"
    },
    {
        prop: "roleName",
        label: "角色名称",
        minWidth: 100
    },
    {
        prop: "code",
        label: "角色编码",
        width: 150,
    },
    {
        prop: "status",
        label: "状态",
        width: 100,
        align: "center",
        render: scope => {
            return (
                <>
                    {scope.row.status === 1 ? (
                        <el-tag type="success">正常</el-tag>
                        ) : (
                        <el-tag type="info">禁用</el-tag>
                    )}
                </>
            )
        } 
    },
    {
        prop: "operation",
        label: "操作",
        fixed: "right",
        width: 220
    },
]);

// 删除菜单信息
const handleDelete = async (roleId?: number, roleName?: string) => {
    const roleIds = [roleId || ids.value].join(",")
    if (!roleIds) {
        ElMessage.warning("请勾选删除项");
        return;
    }

    const message= roleName ? `删除角色【${roleName}】选项` : "删除选定的角色";
    await useHandleData(deleteRoles, { ids: roleIds }, message);
    proTable.value?.getTableList();
};

/**
 * 行checkbox 选中事件
 */
 function handleSelectionChange(selection: any) {
    ids.value = selection.map((item: any) => item.id);
}
  
const drawerRef = ref<InstanceType<typeof RoleDrawer> | null>(null);
const openDrawer = (roleId?: number) => {
    const params = {
        title: roleId ? "修改" : "新增",
        roleId: roleId,
        api: roleId ? updateRole : addRole,
        RoleFormApi: getRoleForm,
        getTableList: proTable.value?.getTableList
    };
    drawerRef.value?.acceptParams(params);
}

const dialogRef = ref<InstanceType<typeof RoleMenuDialog> | null>(null);
const openRoleMenuDialog = (row: RolePageVO) => {
    const params = {
        roleName: row.roleName,
        roleId: row.id,
        api: updateRoleMenus, // 用于更新角色权限的 api
        MenuOptionsListApi: listMenuOptions, // 获取所有菜单
        GetRoleMenuIdsApi: getRoleMenuIds, // 回显角色已拥有的菜单
        getTableList: proTable.value?.getTableList
    }
    dialogRef.value?.acceptParams(params)
}
</script>