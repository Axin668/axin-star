<template>
  <el-scrollbar
    ref="scrollContainer"
    class="scroll-container"
    :vertical="false"
    @wheel.prevent="handleScroll"
  >
    <slot></slot>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { useStore } from '@/store'
import { TagView } from '@/store/modules/tags-view/interface'
const tagAndTagSpacing = ref(4)
const { proxy } = getCurrentInstance() as any

const emits = defineEmits(['scroll'])
const emitScroll = () => {
  emits('scroll')
}

const store = useStore()
const scrollWrapper = computed(() => proxy?.$refs.scrollContainer.$refs.wrapRef)

onMounted(() => {
  scrollWrapper.value.addEventListener('scroll', emitScroll, true)
})
onBeforeUnmount(() => {
  scrollWrapper.value.removeEventListener('scroll', emitScroll)
})

function handleScroll(e: WheelEvent) {
  const eventDelta = (e as any).wheelDelta || -e.deltaY * 40
  scrollWrapper.value.scrollLeft =
    scrollWrapper.value.scrollLeft + eventDelta / 4
}

function moveToTarget(currentTag: TagView) {
  const $container = proxy.$refs.scrollContainer.$el
  const $containerWidth = $container.offsetWidth
  const $scrollerWrapper = scrollWrapper.value

  let firstTag = null
  let lastTag = null

  //find first tag and last tag
  if (store.state.tags_view.visitedViews.length > 0) {
    let length = store.state.tags_view.visitedViews.length
    firstTag = store.state.tags_view.visitedViews.at(0)
    lastTag = store.state.tags_view.visitedViews.at(length - 1)
  }

  if (firstTag === currentTag) {
    $scrollerWrapper.scrollLeft = 0
  } else if (lastTag === currentTag) {
    $scrollerWrapper.scrollLeft = $scrollerWrapper.scrollWidth - $containerWidth
  } else {
    const tagListDom = document.getElementsByClassName('tags-item')
    const currentIndex = store.state.tags_view.visitedViews.findIndex(
      (item) => item === currentTag
    )
    let prevTag = null
    let nextTag = null
    for (const k in tagListDom) {
      if (k !== 'length' && Object.hasOwnProperty.call(tagListDom, k)) {
        if (
          (tagListDom[k] as any).dataset.path ===
          store.state.tags_view.visitedViews.at(currentIndex - 1)?.path
        ) {
          prevTag = tagListDom[k]
        }
        if (
          (tagListDom[k] as any).dataset.path ===
          store.state.tags_view.visitedViews.at(currentIndex + 1)?.path
        ) {
          nextTag = tagListDom[k]
        }
      }
    }

    //the tag's offsetLeft after of nextTag
    const afterNextTagOffsetLeft =
      (nextTag as any).offsetLeft +
      (nextTag as any).offsetWidth +
      tagAndTagSpacing.value

    //the tag's offsetLeft before of prevTag
    const beforePrevTagOffsetLeft =
      (prevTag as any).offsetLeft - tagAndTagSpacing.value
    if (
      afterNextTagOffsetLeft >
      $scrollerWrapper.scrollLeft + $container.scrollWidth
    ) {
      $scrollerWrapper.scrollLeft =
        afterNextTagOffsetLeft - $container.scrollWidth
    } else if (beforePrevTagOffsetLeft < $scrollerWrapper.scrollLeft) {
      $scrollerWrapper.scrollLeft = beforePrevTagOffsetLeft
    }
  }
}

defineExpose({
  moveToTarget
})
</script>

<style lang="scss" scoped>
.scroll-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;

  .el-scrollbar_bar {
    bottom: 0;
  }

  .el-scrollbar_wrap {
    height: 49px;
  }
}
</style>

