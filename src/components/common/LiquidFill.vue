<template>
  <div class="w-[25%] h-[60%] relative">
    <Echart :options="liquidOptions" />
    <div class="absolute left-1/2 transform -translate-x-1/2 text-center">
      <div class="text-white text-[14px] font-semibold">{{ props.title }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Echart from "@/components/common/Echart.vue";

// 定义 props 接收外部传入的标题
interface Props {
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "水位指示器", // 默认标题
});

// 水球图配置
const liquidOptions = ref({
  series: [
    {
      type: "liquidFill",
      radius: "80%",
      data: [0.45], // 初始水位 45%
      label: {
        formatter: "45%",
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
});

// 模拟后台推送：每 1.5 秒随机新水位
setInterval(() => {
  const v = +(Math.random() * 0.5 + 0.2).toFixed(2); // 0.2~0.7
  liquidOptions.value = {
    series: [
      {
        data: [v],
        label: {
          formatter: `${(v * 100).toFixed(0)}%`,
          fontSize: 28,
          color: "#fff",
        },
        radius: "80%",
        type: "liquidFill",
        outline: {
          show: true,
          borderDistance: 4,
          itemStyle: { borderColor: "#6caaa8", borderWidth: 3 },
        },
      },
    ],
  };
}, 1500);
</script>
