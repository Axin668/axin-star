<template>
  <a
    v-if="isExternal(to)"
    :href="to"
    target="_blank"
    rel="noopener"
  >
    <slot />
  </a>
  <div
    v-else
    @click="push"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { isExternal } from '@/utils/index'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/modules/app';

const appStore = useAppStore();

const sidebar = computed(() => appStore.sidebar);
const device = computed(() => appStore.device);

const props = defineProps({
  to: {
    type: String,
    required: true
  }
})

const router = useRouter()

function push() {
  if (device.value === 'mobile' && sidebar.value.opened == true) {
    appStore.closeSideBar(false)
  }
  router.push(props.to).catch((err) => {
    console.log(err)
  })
}
</script>

