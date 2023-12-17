<template>
  <div ref="stickyRef" :style="{height:height+'px', zIndex:zIndex}">
    <div 
      :class="className" 
      :style="{
        top: isSticky ? stickyTop + 'px' : '',
        zIndex: zIndex,
        position: position || 'static',
        width: width,
        height: height + 'px'
      }">
      <slot>
        <div>sticky</div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts" name="ts">
import { onActivated, onMounted, onUnmounted, ref } from 'vue';

const props = defineProps({
    stickyTop: {
        type: Number,
        default: 0
    },
    zIndex: {
        type: Number,
        default: 1,
    },
    className: {
        type: String,
        default: ''
    }
})

const stickyRef = ref<HTMLElement | null>(null) // 创建模板引用

const active = ref<boolean>(false);
const position = ref<any>('');
const width = ref<string | undefined>(undefined);
const height = ref<number | undefined>(undefined);
const isSticky = ref<boolean>(false);

const sticky = () => {
    if (active.value) return;
    position.value = 'fixed';
    active.value = true;
    width.value = width.value + 'px'
    isSticky.value = true;
}

const reset = () => {
    position.value = '';
    width.value = 'auto';
    active.value = false;
    isSticky.value = false;
}

const handleReset = () => {
    if (!active.value) {
        return
    }
    reset();
}

const handleScroll = () => {
    let current_width;
    if (stickyRef.value) {
        current_width = stickyRef.value.getBoundingClientRect().width;
        console.log("current_width: ", current_width)
        width.value = current_width.toString() || 'auto'
        const offsetTop = stickyRef.value.getBoundingClientRect().top;
        console.log("offsetTop", offsetTop)
        if (offsetTop < props.stickyTop) {
            sticky()
            return;
        }
        handleReset()
    }
}

const handleResize = () => {
    if (isSticky.value && stickyRef.value) {
        width.value = stickyRef.value.getBoundingClientRect().width + 'px';
    }
}

onMounted(() => {
    height.value = stickyRef.value!.getBoundingClientRect().height;
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
})

onActivated(() => {
    handleScroll();
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);
})
</script>