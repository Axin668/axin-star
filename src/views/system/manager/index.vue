<template>
    <div class="main-box">
        <TreeFilter
          label="name"
          title="部门列表(单选)"
          :data="treeFilterData"
          :default-value="initParam.deptId"
          @change="changeTreeFilter"
        />
        <div class="table-box">
            <ProTable
              ref="proTable"
              row-key="id"
              :indent="20"
              :columns="columns"
              :request-api="getTableList"
              :request-auto="false"
              :init-param="initParam"
              :search-col="{ xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }"
              @selection-change="handleSelectionChange"
            >
              <!-- 表格 header 按钮 -->
              <template #tableHeader>
                <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增用户</el-button>
                <el-button  type="danger" :icon="Delete" plain :disabled="ids.length === 0" @click="handleDelete()">删除</el-button>
              </template>

              <!-- 表格操作 -->
              <template #operation="scope">
                <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row.id)">查看</el-button>
                <el-button type="primary" v-hasPerm="['sys:user:edit']" link :icon="EditPen" @click="openDrawer('编辑', scope.row.id)">编辑</el-button>
                <el-button type="primary" v-hasPerm="['sys:user:reset_pwd']" link :icon="RefreshLeft" @click="resetPassword(scope.row)">重置密码</el-button>
                <el-button type="primary" v-hasPerm="['sys:user:delete']" link :icon="Delete" @click="handleDelete(scope.row.id, scope.row.managerName)">删除</el-button>
              </template>
            </ProTable>
            <ManagerDrawer ref="drawerRef" />
            <ImportExcel ref="dialogRef" />
        </div>
    </div>
</template>

<script lang="tsx" setup>
import { addManager, deleteManagers, getManagerForm, getManagerPage, updateManager, updateManagerPassword, updateManagerStatus } from '@/api/manager';
import { ManagerPageVO } from '@/api/manager/types';
import { ColumnProps, ProTableInstance } from '@/components/ProTable/interface';
import { useHandleData } from '@/hooks/useHandleData';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import ManagerDrawer from './components/ManagerDrawer.vue';
import ImportExcel from '@/components/ImportExcel/index.vue'
import { listDeptOptions } from '@/api/dept';
import { listRoleOptions } from '@/api/role';
import { CirclePlus, Delete, EditPen, RefreshLeft, View } from '@element-plus/icons-vue';

defineOptions({
    name: "Manager",
    inheritAttrs: false,
});

const proTable = ref<ProTableInstance>();

// 批量删除角色的ids
const ids = ref<number[]>([]);

/**
* 管理员查询
*/
const getTableList = (params: any) => {
    let newParams = JSON.parse(JSON.stringify(params))
    return getManagerPage(newParams);
}

/**
 * 修改管理员状态
 * 
 * @param row
 */
const handleStatusChange = (row: { [key: string]: any }) => {
    const text = row.status === 1 ? "启用" : "停用";
    ElMessageBox.confirm("确定要" + text + "管理员[" + row.managerName + "]吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    })
      .then(() => {
        return updateManagerStatus(row.id, row.status);
      })
      .then(() => {
        ElMessage.success(text + "成功");
      })
      .catch(() => {
        row.status = row.status === 1 ? 0 : 1;
      });
}

// 表格配置项
const columns = reactive<ColumnProps<ManagerPageVO>[]>([
    {
        prop: "keywords",
        label: "关键字",
        search: { el: "input", tooltip: "搜索提示: 目前支持[管理员名称]--[电子邮箱]--[手机号码]关键字~"},
        isShow: false
    },
    {
        type: "selection",
        width: 55,
        align: "center"
    },
    {
        prop: "id",
        label: "编号",
        align: "center",
        width: 100
    },
    {
        prop: "managerName",
        label: "管理员名称",
        align: "center",
        width: 150,
    },
    {
        prop: "genderLabel",
        align: "center",
        label: "性别"
    },
    {
        prop: "deptName",
        label: "所属部门",
        align: "center",
        width: 120
    },
    {
        prop: "email",
        label: "电子邮箱",
        width: 120,
    },
    {
        prop: "mobile",
        label: "手机号码",
        width: 120,
    },
    {
        prop: "status",
        label: "状态",
        width: 100,
        align: "center",
        render: scope => {
            return (
                <>
                    <el-switch 
                        modelvalue={scope.row.status}
                        inactiveValue={0}
                        activeValue={1}
                        onChange={() => handleStatusChange(scope.row)} 
                    />
                </>
            )
        } 
    },
    {
        prop: "createTime",
        align: "center",
        label: "创建时间",
        width: 180,
    },
    {
        prop: "operation",
        label: "操作",
        fixed: "right",
        width: 220
    },
]);

// 删除管理员信息
const handleDelete = async (managerId?: number, managerName?: string) => {
    const managerIds = [managerId || ids.value].join(",")
    if (!managerIds) {
        ElMessage.warning("请勾选删除项");
        return;
    }

    const message= managerName ? `删除管理员【${managerName}】选项` : "删除选定的管理员";
    await useHandleData(deleteManagers, { ids: managerIds }, message);
    proTable.value?.getTableList();
};

/**
 * 行checkbox 选中事件
 */
function handleSelectionChange(selection: any) {
    ids.value = selection.map((item: any) => item.id);
}

/**
 * 重置密码
 */
function resetPassword(row: { [key: string]: any }) {
    ElMessageBox.prompt(
        "请输入管理员[" + row.managerName + "]的新密码",
        "重置密码",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
        }
    )
      .then(({ value }) => {
        if (!value) {
            ElMessage.warning("请输入新密码");
            return false;
        }
        updateManagerPassword(row.id, value).then(() => {
            ElMessage.success("密码重置成功, 新密码是:" + value);
        })
      })
      .catch(() => {})
}

// 如果表格需要初始化请求参数, 直接定义传给 ProTable(之后每次请求都会自动带上该参数, 此参数更改之后也会一直带上, 改变此参数会自动刷新表格数据)
const initParam = reactive({ deptId: "" });

// 获取 treeFilter 数据(和ManagerDrawer里边的deptList一样)
// 当 proTable 的 requestAuto 属性为 false，不会自动请求表格数据，等待 treeFilter 数据回来之后，更改 initParam.deptId 的值，才会触发请求 proTable 数据
const treeFilterData = ref<any>([]);
const getTreeFilter = async () => {
    const { data } = await listDeptOptions()
    treeFilterData.value = data;
    initParam.deptId = treeFilterData.value[1].id;
}

// dept树形列表筛选的点击事件
const changeTreeFilter = (val: string) => {
    ElMessage.success("请注意查看请求参数变化 🤔~")
    proTable.value!.pageable.pageNum = 1;
    initParam.deptId = val; // 只要initParam变化就会重新请求列表
}

const drawerRef = ref<InstanceType<typeof ManagerDrawer> | null>(null);
const openDrawer = (title: string, managerId?: number) => {
    const params = {
        title,
        managerId: managerId,
        isView: title === '查看',
        api: managerId ? updateManager : addManager,
        ManagerFormApi: getManagerForm,
        DeptOptionsApi: listDeptOptions,
        RoleOptionsApi: listRoleOptions,
        getTableList: proTable.value?.getTableList
    };
    drawerRef.value?.acceptParams(params);
}

const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);

onMounted(() => {
    getTreeFilter();
    ElNotification({
        title: "温馨提示",
        message: "该页面 ProTable 数据不会自动请求, 需等待 treeFilter 数据请求完成之后，才会触发表格请求.",
        type: "info",
        duration: 10000
    });
    setTimeout(() => {
        ElNotification({
            title: "温馨提示",
            message: "该页面 ProTable 性别搜索框为远程数据搜索, 详情可查看代码.",
            type: "info",
            duration: 10000
        });
    }, 0);
})
</script>

<style lang="scss" scoped></style>
