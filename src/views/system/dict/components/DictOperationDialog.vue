<template>
    <el-dialog v-model="dialogVisible" :title="`【${dialogProps.title}】字典数据`" :destroy-on-close="true" width="500px" draggable @close="closeDialog">
      <el-form
        ref="dictFormRef"
        label-width="100px"
        label-suffix=" :"
        :rules="rules"
        :model="formData"
      >
        <el-form-item label="字典名称">{{ dialogProps.dictTypeName }}</el-form-item>
        <el-form-item label="字典名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典值" prop="value">
            <el-input v-model="formData.value" placeholder="字典值" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
            <el-input-number
              v-model="formData.sort"
              controls-position="right"
              :min="0"
            />
        </el-form-item>
        <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="0">停用</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" type="textarea" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </template>
    </el-dialog>
</template>
  
<script setup lang="ts" name="DictOperationDialog">
import { ref, reactive } from "vue";
import { ElForm, ElMessage } from "element-plus";
import { DictForm } from "@/api/dict/types";
  
defineOptions({
  name: 'DictDataOperation',
  inheritAttrs: false
})

const loading = ref(false);
const dictFormRef = ref(ElForm);

const rules = reactive({
  name: [{ required: true, message: "请输入字典名称", trigger: "blur" }],
  value: [{ required: true, message: "请输入字典值", trigger: "blur" }],
});

interface DialogProps {
    title: string;
    dictId?: number;  // 用于获取字典表单
    dictTypeCode?: string;  // 记录当前字典类型编码
    dictTypeName?: string;  // 记录当前字典名称 
    api?: (...params: any[]) => Promise<any>;  // 增改api
    DictFormApi?: (dictId: any) => Promise<any>;  // 请求表单详情api
    getTableList?: () => void;  // 刷新分页列表api
}
  
const dialogProps = ref<DialogProps>({
    title: "",
    dictId: 0,
});

const formData = reactive<DictForm>({
    status: 1,
    typeCode: dialogProps.value.dictTypeCode,
    sort: 1,
})

// 控制 dialog 开关
const dialogVisible = ref(false);

// 接收父组件传过来的参数并且打开 Dialog
const acceptParams = (params: DialogProps) => {
    dialogProps.value = params;

    // 编辑界面
    const dictId = dialogProps.value.dictId;
    if (dictId) {
        dialogProps.value.DictFormApi!(dictId)
          .then(({ data }) => {
            // 数据对应填入
            Object.assign(formData, data);
          })
    }
    formData.typeCode = params.dictTypeCode;
    dialogVisible.value = true;
};
  
// 提交数据（新增/编辑）
const handleSubmit = () => {
    dictFormRef.value!.validate(async (valid : boolean) => {
      if (!valid) return;
      try {
        loading.value = true;
        const isAdd = dialogProps.value.title === "新增"
        const apiMethod = dialogProps.value.api!;
        const params = isAdd ? [formData] : [dialogProps.value.dictId, formData]

        await apiMethod(...params);
        ElMessage.success({ message: `${dialogProps.value.title}字典成功！` });
        closeDialog()
        dialogProps.value.getTableList!()
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    });
};
  
/** 关闭 Dialog */
function closeDialog() {
  dialogVisible.value = false;
  resetForm();
}

/**
 * 重置表单
 */
 function resetForm() {
  dictFormRef.value.resetFields();
  dictFormRef.value.clearValidate();

  formData.id = undefined;
  formData.status = 1;
  formData.sort = 1;
  formData.typeCode = dialogProps.value.dictTypeCode;
}

defineExpose({
    acceptParams
});
</script>
  