<template>
    <el-dialog v-model="dialogVisible" :title="`角色【${dialogProps.roleName}】权限分配`" :destroy-on-close="true" width="800px" draggable @close="closeDialog">
      <el-scrollbar v-loading="loading" max-height="600px">
        <el-tree
          ref="roleMenuRef"
          node-key="value"
          show-checkbox
          :data="menuList"
          :default-expand-all="true"
        >
          <template #default="{ data }">
            {{ data.label }}
          </template>
        </el-tree>
      </el-scrollbar>

      <template #footer>
        <el-button type="primary" @click="handleRoleMenuSubmit">确定</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </template>
    </el-dialog>
</template>
  
<script setup lang="ts" name="RoleMenuDialog">
import { ref, reactive } from "vue";
import { ElMessage, ElTree } from "element-plus";
  
defineOptions({
  name: 'RoleMenu',
  inheritAttrs: false
})

const loading = ref(false);
const roleMenuRef = ref(ElTree);
const menuList = ref<global.OptionType[]>([])

interface CheckedRole {
    id?: number,
    roleName?: string,
}
let checkedRole: CheckedRole = reactive({});

interface DialogProps {
    roleName?: string
    roleId?: number,
    api?: (...params: any[]) => Promise<any>;
    MenuOptionsListApi?: () => Promise<any>;
    GetRoleMenuIdsApi?: (param: number) => Promise<any>;
    getTableList?: () => void;
}
  
const dialogProps = ref<DialogProps>({
    roleName: "",
    roleId: 0 // roleId 为 0 即可表示不存在
});

// 控制 dialog 开关
const dialogVisible = ref(false);

// 接收父组件传过来的参数并且打开 Drawer
const acceptParams = (params: DialogProps) => {
    dialogProps.value = params;

    const roleId = dialogProps.value.roleId;
    if (roleId) {
        checkedRole = {
            id: roleId,
            roleName: dialogProps.value.roleName,
        }
        dialogVisible.value = true;
        loading.value = true;

        // 获取所有的菜单
        dialogProps.value.MenuOptionsListApi!().then((resp) => {
            menuList.value = resp.data;
            // 回显角色已拥有的菜单
            dialogProps.value.GetRoleMenuIdsApi!(roleId)
              .then(({ data }) => {
                const checkedMenuIds: number[] = data;
                console.log("勾选权限", checkedMenuIds)
                checkedMenuIds.forEach((menuId) => {
                    roleMenuRef.value.setChecked(menuId, true, false)
                });
              })
              .finally(() => {
                loading.value = false;
              })
        })
    }
};
  
// 提交数据（新增/编辑）
const handleRoleMenuSubmit = () => {
    const roleId = checkedRole.id;
    if (roleId) {
        const checkedMenuIds: number[] = roleMenuRef.value
          .getCheckedNodes(false, true)
          .map((node: any) => node.value);

          loading.value = true;
          dialogProps.value.api!(roleId, checkedMenuIds)
            .then((resq) => {
                ElMessage.success("分配权限成功");
                dialogVisible.value = false;
                dialogProps.value.getTableList!()
            })
            .finally(() => {
                loading.value = false
            })
    }
};
  
/** 关闭 Dialog */
function closeDialog() {
  dialogVisible.value = false;
}

defineExpose({
    acceptParams
});
</script>
  