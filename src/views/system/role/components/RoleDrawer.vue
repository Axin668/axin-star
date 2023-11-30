<template>
    <el-drawer v-model="drawerVisible" append-to-body destroy-on-close size="500px" :title="`${drawerProps.title}角色`" @close="closeDrawer">
      <el-form
        ref="roleFormRef"
        label-width="100px"
        label-suffix=" :"
        :rules="rules"
        :model="formData"
      >
        <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="formData.roleName" placeholder="请输入角色名称" />
        </el-form-item>

        <el-form-item label="角色编码" prop="code">
            <el-input
              v-model="formData.code"
              placeholder="请输入角色编码"
            />
        </el-form-item>

        <el-form-item label="数据权限" prop="dataScope">
            <el-select v-model="formData.dataScope">
                <el-option :key="0" label="所有数据" :value="0" />
                <el-option :key="1" label="部门及子部门数据" :value="1" />
                <el-option :key="2" label="本部门数据" :value="2" />
                <el-option :key="3" label="本人数据" :value="3" />
            </el-select>
        </el-form-item>

        <el-form-item
          label="状态"
          prop="status"
        >
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="排序"
          prop="sort"
        >
          <el-input-number
            v-model="formData.sort"
            style="width: 100px"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
        <el-button @click="closeDrawer">取消</el-button>
      </template>
    </el-drawer>
</template>
  
<script setup lang="ts" name="RoleDrawer">
import { ref, reactive } from "vue";
import { ElForm, ElMessage } from "element-plus";
import { RoleForm } from "@/api/role/types";
  
defineOptions({
  name: 'Role',
  inheritAttrs: false
})

const loading = ref(false);
const roleFormRef = ref(ElForm)

const formData = reactive<RoleForm>({
    sort: 1,
    status: 1,
    code: "",
    roleName: "",
})

const rules = reactive({
    roleName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
    code: [{ required: true, message: "请输入角色编码", trigger: "blur"}],
    dataScope: [{ required: true, message: "请输入数据权限", trigger: "blur"}],
    status: [{ required: true, message: "请选择状态", trigger: "blur" }],
});

// // 定义一个兼容两个函数的类型
// type ApiFunction = {
//   (data: MenuForm): Promise<AxiosResponse<any, any>>;
//   (id: string, data: MenuForm): Promise<AxiosResponse<any, any>>;
// };

interface DrawerProps {
    title: string;
    roleId?: number,
    api?: (...params: any[]) => Promise<any>;
    RoleFormApi?: (menuId: any) => Promise<any>;
    getTableList?: () => void;
}
  
const drawerProps = ref<DrawerProps>({
    title: "",
    roleId: 0 // roleId 为 0 即可表示不存在
});

// 控制 drawer 开关
const drawerVisible = ref(false);

// 接收父组件传过来的参数并且打开 Drawer
const acceptParams = (params: DrawerProps) => {
    drawerProps.value = params;
    if (drawerProps.value.roleId) {
        drawerProps.value.RoleFormApi!(drawerProps.value.roleId)
          .then(({ data }) => {
            // 数据对应填入
            Object.assign(formData, data);
          })
    }
    drawerVisible.value = true
};
  
// 提交数据（新增/编辑）
const handleSubmit = () => {
    roleFormRef.value!.validate(async (valid : boolean) => {
      if (!valid) return;
      try {
        loading.value = true;
        const isAdd = drawerProps.value.title === "新增"
        const apiMethod = drawerProps.value.api!;
        const params = isAdd ? [formData] : [drawerProps.value.roleId!, formData]

        await apiMethod(...params);
        ElMessage.success({ message: `${drawerProps.value.title}菜单成功！` });
        closeDrawer()
        drawerProps.value.getTableList!()
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    });
};
  
/** 关闭 Drawer */
function closeDrawer() {
  drawerVisible.value = false;
  resetForm();
}

/** 重置表单 */
function resetForm() {
  roleFormRef.value.resetFields();
  roleFormRef.value.clearValidate();

  formData.id = undefined;
  formData.sort = 1;
  formData.status = 1;
}

defineExpose({
    acceptParams
});
</script>
  