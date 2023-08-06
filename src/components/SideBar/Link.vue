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
import { useStore } from '@/store'

const store = useStore()

const sidebar = store.getters.sidebar
const device = store.state.app.device

const props = defineProps({
  to: {
    type: String,
    required: true
  }
})

const router = useRouter()

function push() {
  if (device.value === 'mobile' && sidebar.opened == true) {
    store.dispatch('closeSidebar', false)
  }
  router.push(props.to).catch((err) => {
    console.log(err)
  })
}
</script>

