<script setup lang="tsx">
import { addDept, deleteDept, getDeptForm, listDeptOptions, listDepts, updateDept } from '@/api/dept';
import { DeptVO } from '@/api/dept/types';
import { ColumnProps, ProTableInstance } from '@/components/ProTable/interface';
import { useHandleData } from '@/hooks/useHandleData';
import { ElMessage } from 'element-plus';
import DeptDrawer from './components/DeptDrawer.vue';
import { CirclePlus } from '@element-plus/icons-vue';
import { Plus } from '@element-plus/icons-vue';
import { Delete } from '@element-plus/icons-vue';
import { EditPen } from '@element-plus/icons-vue';
import { DeptStatus } from '@/utils/dict';

defineOptions({
    name: "Dept",
    inheritAttrs: false
})

const proTable = ref<ProTableInstance>();

// 批量删除部门的ids
const ids = ref<number[]>([]);

/**
 * 部门查询
 */
const getTableList = (params: any) => {
    let newParams = JSON.parse(JSON.stringify(params));
    return listDepts(newParams);
}

// 表格配置项
const columns = reactive<ColumnProps<DeptVO>[]>([
    {
        prop: "keywords",
        label: "关键字",
        search: { el: "input", tooltip: "搜索提示: 目前仅支持[部门名称]关键字哦~~~"},
        isShow: false
    },
    {
        type: "selection",
        width: 55,
        align: "center"
    },
    {
        prop: "name",
        label: "部门名称",
        align: "left",
        width: 600,
    },
    {
        prop: "status",
        label: "状态",
        width: 100,
        align: "center",
        tag: true,
        enum: DeptStatus,
        search: { el: "tree-select", props: { filterable: true } },
        fieldNames: { label: "label", value: "value" },
        render: scope => {
            return (
              <>
                { scope.row.status === 1 ? (
                    <el-tag type="success">正常</el-tag>
                    ) : (
                    <el-tag type="info">禁用</el-tag>
                )}
              </>
            )
        }
    },
    {
        prop: "sort",
        label: "排序",
        width: 100
    },
    {
        prop: "operation",
        label: "操作",
        fixed: "right",
    }
])

// 删除部门信息
const handleDelete = async (deptId?: number, deptName?: string) => {
    const deptIds = [deptId || ids.value].join(",")
    if (!deptIds) {
        ElMessage.warning("请勾选删除项目");
        return;
    }

    const message = deptName ? `删除部门【${deptName}】选项` : "删除选定的部门";
    await useHandleData(deleteDept, { ids: deptIds }, message);
    proTable.value?.clearSelection();
    proTable.value?.getTableList();
}

// 行checkbox 选中事件
function handleSelectionChange(selection: any) {
    ids.value = selection.map((item: any) => item.id);
}

const drawerRef = ref<InstanceType<typeof DeptDrawer> | null>(null);
const openDrawer = (title: string, parentId?: number, deptId?: number) => {
    const params = {
        title,
        parentId: parentId,
        deptId: deptId,
        api: title === "新增" ? addDept : title === "编辑" ? updateDept : undefined,
        DeptOptionsApi: listDeptOptions,
        DeptFormApi: getDeptForm,
        getTableList: proTable.value?.getTableList
    };
    drawerRef.value?.acceptParams(params);
}
</script>

<template>
    <div class="table-box">
      <ProTable
        ref="proTable"
        :columns="columns"
        :request-api="getTableList"
        row-key="id"
        :pagination=false
        :tree-props="{
          children: 'children',
          hasChildren: 'hasChildren'
        }"
        size="small"
        default-expand-all
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
          <!-- 表格 header 按钮 -->
          <template #tableHeader>
              <el-button v-hasPerm="['sys:dept:add']" type="primary" :icon="CirclePlus" @click="openDrawer('新增', 0)">新增</el-button>
              <el-button v-hasPerm="['sys:dept:delete']" type="danger" :icon="Delete" plain :disabled="ids.length === 0" @click="handleDelete()">删除</el-button>
          </template>
  
          <!-- 表格操作 -->
          <template #operation="scope">
              <el-button v-hasPerm="['sys:dept:add']" type="primary" link :icon="Plus" @click="openDrawer('新增', scope.row.id)">新增</el-button>
              <el-button v-hasPerm="['sys:dept:edit']" type="primary" link :icon="EditPen" @click="openDrawer('编辑', undefined, scope.row.id)">编辑</el-button>
              <el-button v-hasPerm="['sys:dept:delete']" type="primary" link :icon="Delete" @click="handleDelete(scope.row.id, scope.row.name)">删除</el-button>
          </template>
      </ProTable>
      <DeptDrawer ref="drawerRef" />
    </div>
  </template>