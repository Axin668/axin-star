<template>
    <el-drawer v-model="drawerVisible" append-to-body destroy-on-close size="500px" :title="`${drawerProps.title}部门`" @close="closeDrawer">
      <el-form
        ref="deptFormRef"
        label-width="100px"
        label-suffix=" :"
        :rules="rules"
        :model="formData"
      >
        <el-form-item label="上级部门" prop="parentId">
            <el-tree-select
              v-model="formData.parentId"
              placeholder="选择上级部门"
              :data="deptOptions"
              filterable
              check-strictly
              :render-after-expand="false"
            />
        </el-form-item>

        <el-form-item label="部门名称" prop="name">
            <el-input
              v-model="formData.name"
              placeholder="请输入部门名称"
            />
        </el-form-item>

        <el-form-item
          label="部门状态"
        >
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          label="显示排序"
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
        <el-button @click="closeDrawer">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-drawer>
</template>
  
<script setup lang="ts" name="MenuDrawer">
import { ref, reactive } from "vue";
import { ElForm, ElMessage } from "element-plus";
import { DeptForm } from "@/api/dept/types";
  
defineOptions({
  name: 'Dept',
  inheritAttrs: false
})

const deptFormRef = ref(ElForm)

const deptOptions = ref<global.OptionType[]>([])
const formData = reactive<DeptForm>({
    status: 1,
    parentId: 0,
    sort: 1
})

const rules = reactive({
  parentId: [{ required: true, message: "上级部门不能为空", trigger: "blur" }],
  name: [{ required: true, message: "部门名称不能为空", trigger: "blur" }],
  sort: [{ required: true, message: "显示排序不能为空", trigger: "blur" }],
});

interface DrawerProps {
    title: string;
    parentId?: number,
    deptId?: number;
    api?: (...params: any[]) => Promise<any>;
    DeptOptionsApi?: () => Promise<any>;
    DeptFormApi?: (menuId: any) => Promise<any>;
    getTableList?: () => void;
}
  
const drawerProps = ref<DrawerProps>({
    title: "",
    parentId: 0
});

// 控制 drawer 开关
const drawerVisible = ref(false);

// 接收父组件传过来的参数并且打开 Drawer
const acceptParams = (params: DrawerProps) => {
    drawerProps.value = params;
    drawerProps.value.DeptOptionsApi!()
      .then(({ data }) => {
        deptOptions.value = [{ value: 0, label: "顶级部门", children: data }]
      })
      .then(() => {
        if (drawerProps.value.title === "编辑") {
          drawerProps.value.DeptFormApi!(drawerProps.value.deptId)
            .then(({ data }) => {
              Object.assign(formData, data);
            })
        } else {
          formData.parentId = drawerProps.value.parentId
        }
      })
      drawerVisible.value = true
};

// 提交数据（新增/编辑）
const handleSubmit = () => {
    deptFormRef.value!.validate(async (valid : boolean) => {
      if (!valid) return;
      try {
        if (drawerProps.value.title === "新增") {
          await drawerProps.value.api!(formData);
        } else if (drawerProps.value.title === "编辑") {
          const deptId = drawerProps.value.deptId
          await drawerProps.value.api!(deptId!.toString(), formData);
        }
        ElMessage.success({ message: `${drawerProps.value.title}部门成功！` });
        drawerProps.value.getTableList!();
        closeDrawer();
      } catch (error) {
        console.log(error);
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
  deptFormRef.value.resetFields();
  deptFormRef.value.clearValidate();

  formData.id = undefined;
  formData.parentId = 0;
  formData.sort = 1;
  formData.status = 1;
}

defineExpose({
    acceptParams
});
</script>
  