<template>
    <el-drawer v-model="drawerVisible" append-to-body destroy-on-close size="600px" :title="`${drawerProps.title}管理员`" @close="closeDrawer">
      <el-form
        ref="managerFormRef"
        label-width="100px"
        label-suffix=" :"
        :rules="rules"
        :model="formData"
        :disabled="drawerProps.isView"
        :hide-required-asterisk="drawerProps.isView"
      >
        <el-form-item label="管理员名称" prop="managerName">
            <el-input v-model="formData.id" :readonly="!!formData.id" placeholder="请输入管理员名称" />
        </el-form-item>

        <el-form-item label="所属部门" prop="deptId">
            <el-tree-select
              v-model="formData.deptId"
              placeholder="请选择所属部门"
              :data="deptList"
              filterable
              check-strictly
              :render-after-expand="false"
              />
        </el-form-item>

        <el-form-item label="性别" prop="gender">
          <dictionary v-model="formData.gender" type-code="gender" />
        </el-form-item>

        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="formData.roleIds" multiple placeholder="请分配角色">
            <el-option 
              v-for="item in roleList"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="手机号码" prop="mobile">
          <el-input 
            v-model="formData.mobile"
            placeholder="请输入手机号码"
            maxlength="11"
          />
        </el-form-item>

        <el-form-item label="电子邮箱" prop="email">
          <el-input 
            v-model="formData.email"
            placeholder="请输入电子邮箱"
            maxlength="50"
          />
        </el-form-item>

        <el-form-item
          label="状态"
          prop="status"
        >
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <template #footer>
          <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
          <el-button @click="closeDrawer">取消</el-button>
        </template>
      </el-form>
    </el-drawer>
</template>
  
<script setup lang="ts" name="ManagerDrawer">
import { ref, reactive } from "vue";
import { ElForm, ElMessage } from "element-plus";
import { ManagerForm } from "@/api/manager/types";
  
defineOptions({
  name: 'Manager',
  inheritAttrs: false
})

const loading = ref(false);
const managerFormRef = ref(ElForm) // 用作校验

const formData = reactive<ManagerForm>({
    status: 1,
})

const rules = reactive({
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  deptId: [{ required: true, message: "所属部门不能为空", trigger: "blur" }],
  roleIds: [{ required: true, message: "用户角色不能为空", trigger: "blur" }],
  email: [
    {
      pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      message: "请输入正确的邮箱地址",
      trigger: "blur",
    },
  ],
  mobile: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
});

const deptList = ref<global.OptionType[]>();
const roleList = ref<global.OptionType[]>();

// // 定义一个兼容两个函数的类型
// type ApiFunction = {
//   (data: MenuForm): Promise<AxiosResponse<any, any>>;
//   (id: string, data: MenuForm): Promise<AxiosResponse<any, any>>;
// };

interface DrawerProps {
    title: string;
    managerId?: number,
    isView: boolean,
    // api是add或者update之一
    api?: (...params: any[]) => Promise<any>;
    ManagerFormApi?: (managerId: any) => Promise<any>;
    DeptOptionsApi?: () => Promise<any>;
    RoleOptionsApi?: () => Promise<any>;
    getTableList?: () => void;
}
  
const drawerProps = ref<DrawerProps>({
    title: "",
    isView: false,
    managerId: -1 // managerId 为 -1 即可表示不存在(或者undefined)
});

// 控制 drawer 开关
const drawerVisible = ref(false);

// 接收父组件传过来的参数并且打开 Drawer
const acceptParams = async (params: DrawerProps) => {
    drawerProps.value = params;

    // 获取部门下拉列表
    // 获取角色下拉列表
    try {
      const deptOptionsApi = drawerProps.value.DeptOptionsApi;
      const roleOptionsApi = drawerProps.value.RoleOptionsApi;

      if (deptOptionsApi) {
        const deptResponse = await deptOptionsApi();
        deptList.value = deptResponse.data
      }

      if (roleOptionsApi) {
        const roleResponse = await roleOptionsApi();
        roleList.value = roleResponse.data;
      }
    } catch (error) {
      ElMessage.error("Error loading options data" + error);
    }

    if (drawerProps.value.managerId) {
        drawerProps.value.ManagerFormApi!(drawerProps.value.managerId)
          .then(({ data }) => {
            // 数据对应填入
            Object.assign(formData, data);
          })
    }
    drawerVisible.value = true
};
  
// 提交数据（新增/编辑）
const handleSubmit = () => {
    managerFormRef.value!.validate(async (valid : boolean) => {
      if (!valid) return;
      try {
        loading.value = true;
        const isAdd = drawerProps.value.title === "新增"
        const apiMethod = drawerProps.value.api!;
        const params = isAdd ? [formData] : [drawerProps.value.managerId!, formData]

        await apiMethod(...params);
        ElMessage.success({ message: `${drawerProps.value.title}管理员成功！` });
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
  managerFormRef.value.resetFields();
  managerFormRef.value.clearValidate();

  formData.id = undefined;
  formData.status = 1;
}

defineExpose({
    acceptParams
});
</script>
  