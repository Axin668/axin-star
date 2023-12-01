<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      row-key="id"
      :pagination=false
      :tree-props="{
        children: 'children',
        hasChildren: 'hasChildren'
      }"
      size="small"
      default-expand-all
      highlight-current-row
      @row-click="onRowClick"
    >
        <!-- 表格 header 按钮 -->
        <template #tableHeader>
            <el-button v-hasPerm="['sys:menu:add']" type="primary" :icon="CirclePlus" @click="openDrawer('新增', 0)">新增</el-button>
        </template>

        <!-- 表格操作 -->
        <template #operation="scope">
            <el-button v-hasPerm="['sys:menu:add']" v-if="scope.row.type === 'CATALOG' || scope.row.type === 'MENU'" type="primary" link :icon="Plus" @click="openDrawer('新增', scope.row.id)">新建</el-button>
            <el-button v-hasPerm="['sys:menu:edit']" type="primary" link :icon="EditPen" @click="openDrawer('编辑', undefined, scope.row.id)">编辑</el-button>
            <el-button v-hasPerm="['sys:menu:delete']" type="primary" link :icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
    </ProTable>
    <MenuDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="tsx">
import { ColumnProps, ProTableInstance } from '@/components/ProTable/interface';
import { MenuTypeEnum } from '@/enums/MenuTypeEnum';
import { MenuVO } from '@/api/menu/types';
import { Delete, EditPen, CirclePlus, Plus } from "@element-plus/icons-vue";
import { addMenu, deleteMenu, getMenuForm, listMenuOptions, listMenus, updateMenu } from '@/api/menu';
import MenuDrawer from './components/MenuDrawer.vue';
import { useHandleData } from '@/hooks/useHandleData';
import { resolveComponent } from 'vue';

const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1});

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
// 这里不需要分页 不需要callback数据
const dataCallback = (data: any) => {
    return {
        list: data.list as [],
        total: parseInt(data.total), // 这里要parseInt, 否则会报错
        pageNum: data.pageNum,
        pageSize: data.pageSize
    };
}

/**
 * 菜单查询
 */
const getTableList = (params: any) => {
    let newParams = JSON.parse(JSON.stringify(params))
    return listMenus(newParams);
}

// 表格配置项
const columns = reactive<ColumnProps<MenuVO>[]>([
    {
        prop: "keywords",
        label: "关键字",
        search: { el: "input", tooltip: "搜索提示: 目前仅支持[菜单名称]关键字哦~~~"},
        isShow: false
    },
    {
        prop: "name",
        label: "菜单名称",
        align: "left",
        width: 400,
        render: scope => {
            return (
                <>
                    <el-icon size={12}>
                        {scope.row.icon && h(resolveComponent(scope.row.icon))}
                    </el-icon>
                    &nbsp;
                    <span>{scope.row.name}</span>
                </>
            )
        }
    },
    {
        prop: "type",
        label: "类型",
        width: 80,
        render: scope => {
            return (
                <>
                  {scope.row.type === MenuTypeEnum.CATALOG && <el-tag type="warning">目录</el-tag>}
                  {scope.row.type === MenuTypeEnum.MENU && <el-tag type="success">菜单</el-tag>}
                  {scope.row.type === MenuTypeEnum.BUTTON && <el-tag type="danger">按钮</el-tag>}
                  {scope.row.type === MenuTypeEnum.EXTLINK && <el-tag type="info">外链</el-tag>}
                </>
            )
        }
    },
    {
        prop: "path",
        label: "路由路径",
        width: 150, 
    },
    {
        prop: "component",
        label: "组件路径",
        width: 250, 
    },
    {
        prop: "perm",
        label: "权限标识",
        width: 200, 
    },
    {
        prop: "visible",
        label: "状态",
        width: 80,
        render: scope => {
            return (
                    <>
                      {scope.row.visible === 1 ? (
                        <el-tag type="success">显示</el-tag>
                        ) : (
                        <el-tag type="info">隐藏</el-tag>
                      )}
                    </>
            );
        }
    },
    {
        prop: "sort",
        label: "排序",
        width: 80, 
    },
    {
        prop: "operation",
        label: "操作",
        fixed: "right",
        width: 295
    },
]);

// 删除菜单信息
const handleDelete = async (params: MenuVO) => {
  await useHandleData(deleteMenu, { id: params.id }, `删除菜单【${params.name}】选项`);
  proTable.value?.getTableList();
};

//选择表格的行菜单ID
const selectedRowMenuId = ref<number | undefined>()

/** 行点击事件 */
function onRowClick(row: MenuVO) {
  selectedRowMenuId.value = row.id
}

const drawerRef = ref<InstanceType<typeof MenuDrawer> | null>(null);
const openDrawer = (title: string, parentId?: number, menuId?: number) => {
    const params = {
        title,
        parentId: parentId,
        menuId: menuId,
        api: title === "新增" ? addMenu : title === "编辑" ? updateMenu : undefined,
        MenuOptionsApi: listMenuOptions,
        MenuFormApi: getMenuForm,
        getTableList: proTable.value?.getTableList
    };
    drawerRef.value?.acceptParams(params);
}
</script>