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
              <el-button v-hasPerm="['sys:dict_type:add']" type="primary" :icon="CirclePlus" @click="openDrawer()">新增</el-button>
              <el-button v-hasPerm="['sys:dict_type:delete']" type="danger" :icon="Delete" plain :disabled="ids.length === 0" @click="handleDelete()">删除</el-button>
          </template>
  
          <!-- 表格操作 -->
          <template #operation="scope">
              <el-button type="primary" size="small" link @click="openDictDialog(scope.row)"><i-ep-Collection /> 字典数据</el-button>
              <el-button v-hasPerm="['sys:dict_type:edit']" type="primary" size="small" link @click="openDrawer(scope.row.id)"><i-ep-edit /> 编辑</el-button>
              <el-button v-hasPerm="['sys:dict_type:delete']" type="primary" size="small" link @click="handleDelete(scope.row.id, scope.row.name)">删除</el-button>
          </template>
      </ProTable>
      <DictTypeDrawer ref="drawerRef" />
      <DictDialog ref="dialogRef" />
    </div>
  </template>
  
<script setup lang="tsx">
import { ColumnProps, ProTableInstance } from '@/components/ProTable/interface';
import { Delete, CirclePlus } from "@element-plus/icons-vue";
import { useHandleData } from '@/hooks/useHandleData';
import { ElMessage } from 'element-plus';
import { RolePageVO } from '@/api/role/types';
import { addDictType, deleteDictTypes, getDictTypeForm, getDictTypePage, updateDictType } from '@/api/dict';
import DictTypeDrawer from './components/DictTypeDrawer.vue';
import { DictTypePageVO } from '@/api/dict/types';
import DictDialog from './components/DictDialog.vue';
  
defineOptions({
    name: "DictType",
    inheritAttrs: false,
});

const proTable = ref<ProTableInstance>();
  
// 批量删除字典类型的ids
const ids = ref<number[]>([]);
  
/**
* 字典类型查询
*/
const getTableList = (params: any) => {
    let newParams = JSON.parse(JSON.stringify(params))
    return getDictTypePage(newParams);
}
  
// 表格配置项
const columns = reactive<ColumnProps<RolePageVO>[]>([
    {
        prop: "keywords",
        label: "关键字",
        search: { el: "input", tooltip: "搜索提示: 目前支持[字典类型名称]以及[字典类型编码]关键字~"},
        isShow: false
    },
    {
        type: "selection",
        width: 55,
        align: "center"
    },
    {
        prop: "name",
        label: "字典类型名称",
        minWidth: 200
    },
    {
        prop: "code",
        label: "字典类型编码",
        width: 200,
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
                        <el-tag type="success">启用</el-tag>
                        ) : (
                        <el-tag type="info">禁用</el-tag>
                    )}
                </>
            )
        } 
    },
    {
        prop: "remark",
        label: "备注",
        align: "center",
    },
    {
        prop: "operation",
        label: "操作",
        fixed: "right",
        align: "center",
        width: 220
    },
]);

// 删除字典类型信息
const handleDelete = async (dictTypeId?: number, dictTypeName?: string) => {
    const dictTypeIds = [dictTypeId || ids.value].join(",")
    if (!dictTypeIds) {
        ElMessage.warning("请勾选删除项");
        return;
    }

    const message = dictTypeName ? `删除字典类型【${dictTypeName}】选项` : "删除选定的字典类型";
    await useHandleData(deleteDictTypes, { ids: dictTypeIds }, message);
    proTable.value?.clearSelection();
    proTable.value?.getTableList();
};

/**
 * 行checkbox 选中事件
 */
 function handleSelectionChange(selection: any) {
    ids.value = selection.map((item: any) => item.id);
}

/**
 * 字典类型增改Drawer
 */
const drawerRef = ref<InstanceType<typeof DictTypeDrawer> | null>(null);
const openDrawer = (dictTypeId?: number) => {
    const params = {
        title: dictTypeId ? "修改" : "新增",
        dictTypeId: dictTypeId,
        api: dictTypeId ? updateDictType : addDictType,
        DictTypeFormApi: getDictTypeForm,
        getTableList: proTable.value?.getTableList
    };
    drawerRef.value?.acceptParams(params);
}

/**
 * 对应字典类型的字典列表Dialog
 */
const dialogRef = ref<InstanceType<typeof DictDialog> | null>(null);
const openDictDialog = (row: DictTypePageVO) => {
    const params = {
        typeCode: row.code,
        typeName: row.name,
    }
    dialogRef.value?.acceptParams(params)
}
</script>