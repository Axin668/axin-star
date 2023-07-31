<template>
    <el-button type="text" @click="toggle" class="humburger">
        <el-icon :size="25"><fold/></el-icon>
    </el-button>
</template>

<script lang="ts" setup name="Hamburger">

const emits = defineEmits(["changeIsCollapse"]);
const toggle = ():void => {
    emits("changeIsCollapse")
}
</script>

<style lang="scss" scoped>
.humburger {
    margin-top: 16px;
    margin-left: 10px;
}
</style>