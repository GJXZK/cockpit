<template>
  <div
    class="relative w-full h-[30px] overflow-hidden rounded flex items-center"
    
  >
    <!-- 背景图 -->
    <img :src="imgSrc" alt="header background" class="absolute object-cover" />
    <!-- 标题文字 -->
    <h1 class="absolute z-10 text-white! text-[18px] font-bold pl-10 select-none">
      {{ props.title }}
    </h1>
  </div>
</template>

<script setup lang="ts">
interface Props {
  /** 标题文字 */
  title: string;
  /** 图片路径，可选 */
  imgSrc?: string;
  /** 头部高度，可传入 '150px'、'10rem'、'30vh' 等 */
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  imgSrc: new URL("@/assets/picture/title_header.png", import.meta.url).href,
  height: "200px",
});
</script>
