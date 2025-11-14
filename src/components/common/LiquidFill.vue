<template>
  <div class="w-[25%] h-[60%] relative">
    <Echart :options="liquidOptions" />
    <div class="absolute left-1/2 transform -translate-x-1/2 text-center">
      <div class="text-white text-[14px] font-semibold">{{ props.title }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Echart from "@/components/common/Echart.vue";

// 定义 props 接收外部传入的标题
interface Props {
  title?: string;
  value?: number;
}

const props = withDefaults(defineProps<Props>(), {
  title: "水位指示器", // 默认标题
  value: 0, // 默认水位值
});

// 水球图配置
// 使用计算属性
const liquidOptions = computed(() => ({
  series: [
    {
      type: "liquidFill",
      radius: "80%",
      data: [props.value/100], // 响应式更新
      label: {
        formatter: `${props.value.toFixed(0)}%`, // 响应式更新
        fontSize: 28,
        color: "#fff",
      },
      outline: {
        show: true,
        borderDistance: 4,
        itemStyle: { borderColor: "#6caaa8", borderWidth: 3 },
      },
    },
  ],
}));
</script>
