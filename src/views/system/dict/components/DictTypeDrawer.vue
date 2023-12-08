
<template>
    <el-drawer v-model="drawerVisible" append-to-body destroy-on-close size="500px" :title="`${drawerProps.title}字典类型`" @close="closeDrawer">
      <el-form
        ref="dictTypeFormRef"
        label-width="125px"
        label-suffix=" :"
        :rules="rules"
        :model="formData"
      >
        <el-form-item label="字典类型名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入字典类型名称" />
        </el-form-item>

        <el-form-item label="字典类型编码" prop="code">
            <el-input
              v-model="formData.code"
              placeholder="请输入字典类型编码"
            />
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
          label="备注"
          prop="remark"
        >
          <el-input
            v-model="formData.remark"
            type="textarea"
            placeholder="字典类型备注"
            :autosize="{ minRows: 2, maxRows: 4 }"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
        <el-button @click="closeDrawer">取消</el-button>
      </template>
    </el-drawer>
</template>
  
<script setup lang="ts" name="DictTypeDrawer">
import { ref, reactive } from "vue";
import { ElForm, ElMessage } from "element-plus";
import { DictTypeForm } from "@/api/dict/types";
  
defineOptions({
  name: 'DictType',
  inheritAttrs: false
})

const loading = ref(false);
const dictTypeFormRef = ref(ElForm)

const formData = reactive<DictTypeForm>({
    status: 1,
})

const rules = reactive({
  name: [{ required: true, message: "请输入字典类型名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入字典类型编码", trigger: "blur" }],
});

interface DrawerProps {
    title: string;
    dictTypeId?: number,
    api?: (...params: any[]) => Promise<any>;
    DictTypeFormApi?: (dictTypeId: any) => Promise<any>;
    getTableList?: () => void;
}
  
const drawerProps = ref<DrawerProps>({
    title: "",
    dictTypeId: 0 // dictTypeId 为 0 即可表示不存在
});

// 控制 drawer 开关
const drawerVisible = ref(false);

// 接收父组件传过来的参数并且打开 Drawer
const acceptParams = (params: DrawerProps) => {
    drawerProps.value = params;
    if (drawerProps.value.dictTypeId) {
        drawerProps.value.DictTypeFormApi!(drawerProps.value.dictTypeId)
          .then(({ data }) => {
            // 数据对应填入
            Object.assign(formData, data);
          })
    }
    drawerVisible.value = true
};
  
// 提交数据（新增/编辑）
const handleSubmit = () => {
    dictTypeFormRef.value!.validate(async (valid : boolean) => {
      if (!valid) return;
      try {
        loading.value = true;
        const isAdd = drawerProps.value.title === "新增"
        const apiMethod = drawerProps.value.api!;
        const params = isAdd ? [formData] : [drawerProps.value.dictTypeId!, formData]

        await apiMethod(...params);
        ElMessage.success({ message: `${drawerProps.value.title}字典类型成功！` });
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
  dictTypeFormRef.value.resetFields();
  dictTypeFormRef.value.clearValidate();

  formData.id = undefined;
  formData.status = 1;
}

defineExpose({
    acceptParams
});
</script>
  