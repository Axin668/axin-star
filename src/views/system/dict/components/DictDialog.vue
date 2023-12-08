<template>
  <el-dialog
    v-model="dialogVisible" 
    :title="`【${dialogProps.typeName}】字典数据`" 
    :destroy-on-close="true" 
    width="1000px" 
    draggable 
    @close="closeDictDataDialog"
  >
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      row-key="id"
      size="small"
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
            <el-button v-hasPerm="['sys:dict:add']" type="primary" :icon="CirclePlus" @click="openDictOperationDialog()">新增</el-button>
            <el-button v-hasPerm="['sys:dict:delete']" type="danger" :icon="Delete" plain :disabled="ids.length === 0" @click="handleDelete()">删除</el-button>
        </template>

        <!-- 表格操作 -->
        <template #operation="scope">
            <el-button v-hasPerm="['sys:dict:edit']" type="primary" size="small" link @click="openDictOperationDialog(scope.row.id)"><i-ep-edit /> 编辑</el-button>
            <el-button v-hasPerm="['sys:dict:delete']" type="primary" size="small" link @click="handleDelete(scope.row.id, scope.row.name)">删除</el-button>
        </template>
    </ProTable>
    <DictOperationDialog ref="dialogRef" />
  </el-dialog>
</template>

<script setup lang="tsx">
import { ColumnProps, ProTableInstance } from '@/components/ProTable/interface';
import { Delete, CirclePlus } from "@element-plus/icons-vue";
import { useHandleData } from '@/hooks/useHandleData';
import { ElMessage } from 'element-plus';
import { RolePageVO } from '@/api/role/types';
import { addDict, deleteDict, getDictFormData, getDictPage, updateDict } from '@/api/dict';
import DictOperationDialog from './DictOperationDialog.vue';

defineOptions({
  name: "DictData",
  inheritAttrs: false,
});

const proTable = ref<ProTableInstance>();

// 批量删除字典类型的ids
const ids = ref<number[]>([]);

interface DialogProps {
    typeCode?: string;
    typeName?: string;
}
  
const dialogProps = ref<DialogProps>({
    typeCode: "",
    typeName: ""
});

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
// 这里要将字典类型typeCode传入, 用来请求对应的字典数据
const initParam = reactive({ name: "", typeCode: "" });

// 控制 dialog 开关
const dialogVisible = ref(false);

/**
* 字典数据(指定类型)查询
*/
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params))
  ElMessage.success({ message: `获取字典[${dialogProps.value.typeName}]数据成功！` })
  return getDictPage(newParams);
}

// 接收父组件传过来的参数并且打开 Dialog
const acceptParams = async (params: DialogProps) => {
    dialogProps.value = params;
    initParam.name = params.typeName!;
    initParam.typeCode = params.typeCode!
    dialogVisible.value = true;
};

// 表格配置项
const columns = reactive<ColumnProps<RolePageVO>[]>([
  {
      prop: "keywords",
      label: "关键字",
      search: { el: "input", tooltip: "搜索提示: 目前支持[字典名称]关键字~"},
      isShow: false
  },
  {
      type: "selection",
      width: 50,
      align: "center"
  },
  {
      prop: "name",
      label: "字典名称",
  },
  {
      prop: "value",
      label: "字典值",
  },
  {
      prop: "status",
      label: "状态",
      align: "center",
      render: scope => {
          return (
              <>
                  {scope.row.status === 1 ? (
                      <el-tag type="success">启用</el-tag>
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
      align: "center",
  },
]);

// 删除字典信息
const handleDelete = async (dictId?: number, dictName?: string) => {
  const dictIds = [dictId || ids.value].join(",")
  if (!dictIds) {
      ElMessage.warning("请勾选删除项");
      return;
  }

  const message = dictName ? `删除字典【${dictName}】选项` : "删除选定的字典";
  await useHandleData(deleteDict, { ids: dictIds }, message);
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

/**
* 行checkbox 选中事件
*/
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/** 关闭 Dialog */
function closeDictDataDialog() {
  dialogVisible.value = false;
}

/**
 * 字典数据操作Dialog
 */
const dialogRef = ref<InstanceType<typeof DictOperationDialog> | null>(null);
const openDictOperationDialog = (dictId?: number) => {
  const params = {
      title: dictId ? "修改" : "新增",
      dictId: dictId,
      dictTypeCode: dialogProps.value.typeCode,
      dictTypeName: dialogProps.value.typeName,
      api: dictId ? updateDict : addDict,
      DictFormApi: getDictFormData,
      getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
}

defineExpose({
    acceptParams
});
</script>