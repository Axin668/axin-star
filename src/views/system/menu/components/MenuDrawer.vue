<template>
    <el-drawer v-model="drawerVisible" append-to-body destroy-on-close size="500px" :title="`${drawerProps.title}菜单`" @close="closeDrawer">
      <el-form
        ref="menuFormRef"
        label-width="100px"
        label-suffix=" :"
        :rules="rules"
        :model="formData"
      >
        <el-form-item label="父级菜单" prop="parentId">
            <el-tree-select
              v-model="formData.parentId"
              placeholder="选择上级菜单"
              :data="menuOptions"
              filterable
              check-strictly
              :render-after-expand="false"
            />
        </el-form-item>

        <el-form-item label="菜单名称" prop="name">
            <el-input
              v-model="formData.name"
              placeholder="请输入菜单名称"
            />
        </el-form-item>

        <el-form-item label="菜单类型" prop="type">
            <el-radio-group
              v-model="formData.type"
              @change="onMenuTypeChange"
            >
              <el-radio label="CATALOG">目录</el-radio>
              <el-radio label="MENU">菜单</el-radio>
              <el-radio label="BUTTON">按钮</el-radio>
              <el-radio label="EXTLINK">外链</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item v-if="formData.type === 'EXTLINK'" label="外链地址" prop="path">
            <el-input
              v-model="formData.path"
              placeholder="请输入外链完整路径"
            />
        </el-form-item>

        <el-form-item v-if="formData.type === 'CATALOG' || formData.type === 'MENU'" label="路由路径" prop="path">
          <el-input v-if="formData.type === 'CATALOG'" v-model="formData.path" placeholder="system" clearable></el-input>
          <el-input v-else v-model="formData.path" placeholder="manager" clearable></el-input>
        </el-form-item>

        <!-- 组件页面完整路径 -->
        <el-form-item v-if="formData.type === MenuTypeEnum.MENU" label="页面路径" prop="component">
            <el-input
              v-model="formData.component"
              placeholder="system/manager/index"
              style="width: 95%"
            >
              <template
                v-if="formData.type === MenuTypeEnum.MENU"
                #prepend
              >
                src/views/
              </template>
              <template
                v-if="formData.type === MenuTypeEnum.MENU"
                #append
              >
                .vue
              </template>
            </el-input>
        </el-form-item>

        <el-form-item v-if="formData.type === 'BUTTON'" label="权限标识" prop="perm">
            <el-input
              v-model="formData.perm"
              placeholder="sys:manager:add"
            />
        </el-form-item>

        <el-form-item
          v-if="formData.type !== 'BUTTON'"
          label="图标"
          prop="icon"
        >
          <!-- 图标选择器 -->
          <icon-select v-model="formData.icon" />
        </el-form-item>

        <!-- 临时修改图标名称 -->
        <!-- <el-form-item
          v-if="formData.type !== 'BUTTON'"
          label="图标tmp"
          prop="icon"
        >
          <el-input v-model="formData.icon"></el-input>
        </el-form-item> -->

        <el-form-item
          v-if="formData.type === 'CATALOG'"
          label="跳转路由"
        >
          <el-input
            v-model="formData.redirect"
            placeholder="跳转路由"
          />
        </el-form-item>

        <el-form-item
          v-if="formData.type !== 'BUTTON'"
          label="状态"
          prop="visible"
        >
          <el-radio-group v-model="formData.visible">
            <el-radio :label="1">显示</el-radio>
            <el-radio :label="2">隐藏</el-radio>
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
        <el-button @click="closeDrawer">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-drawer>
</template>
  
<script setup lang="ts" name="MenuDrawer">
import { ref, reactive } from "vue";
import { ElForm, ElMessage } from "element-plus";
import { MenuForm } from "@/api/menu/types";
import { MenuTypeEnum } from "@/enums/MenuTypeEnum";
  
defineOptions({
  name: 'Menu',
  inheritAttrs: false
})

const menuFormRef = ref(ElForm)

const menuOptions = ref<global.OptionType[]>([])
const formData = reactive<MenuForm>({
  parentId: 0,
  visible: 1,
  sort: 1,
  type: MenuTypeEnum.MENU
})

const rules = reactive({
  parentId: [{ required: true, message: '请选择顶级菜单', trigger: 'blur' }],
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
  component: [
    { required: true, message: '请输入组件完整路径', trigger: 'blur' }
  ]
})

const menuCacheData = reactive({
  type: '',
  path: ''
})

// // 定义一个兼容两个函数的类型
// type ApiFunction = {
//   (data: MenuForm): Promise<AxiosResponse<any, any>>;
//   (id: string, data: MenuForm): Promise<AxiosResponse<any, any>>;
// };

interface DrawerProps {
    title: string;
    parentId?: number,
    menuId?: number;
    api?: (...params: any[]) => Promise<any>;
    MenuOptionsApi?: () => Promise<any>;
    MenuFormApi?: (menuId: any) => Promise<any>;
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
    drawerProps.value.MenuOptionsApi!()
      .then(({ data }) => {
        menuOptions.value = [{ value: 0, label: "顶级菜单", children: data }]
      })
      .then(() => {
        if (drawerProps.value.title === "编辑") {
          drawerProps.value.MenuFormApi!(drawerProps.value.menuId)
            .then(({ data }) => {
              Object.assign(formData, data);
              menuCacheData.type = data.type
              menuCacheData.path = data.path ?? ''
            })
        } else {
          formData.parentId = drawerProps.value.parentId
        }
      })
      drawerVisible.value = true
};
  
/** 菜单类型切换事件处理 */
function onMenuTypeChange() {
  // 如果菜单类型改变, 清空路由路径; 未改变的话在切换后还原路由路径
  if (formData.type !== menuCacheData.type) {
    formData.path = ''
  } else {
    formData.path = menuCacheData.path
  }
}

// 提交数据（新增/编辑）
const handleSubmit = () => {
    menuFormRef.value!.validate(async (valid : boolean) => {
      if (!valid) return;
      try {
        if (drawerProps.value.title === "新增") {
          await drawerProps.value.api!(formData);
        } else if (drawerProps.value.title === "编辑") {
          const menuId = drawerProps.value.menuId
          await drawerProps.value.api!(menuId!.toString(), formData);
        }
        ElMessage.success({ message: `${drawerProps.value.title}菜单成功！` });
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
  menuFormRef.value.resetFields();
  menuFormRef.value.clearValidate();

  formData.id = undefined;
  formData.parentId = 0;
  formData.visible = 1;
  formData.sort = 1;
  formData.perm = undefined;
  formData.component = undefined;
  formData.path = undefined;
  formData.redirect = undefined;
}

defineExpose({
    acceptParams
});
</script>
  