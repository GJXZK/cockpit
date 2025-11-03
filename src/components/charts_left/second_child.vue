<script setup lang="ts">
import Echart from "@/components/common/Echart.vue";
import type { EChartsOption } from "echarts";
import { ref } from "vue";

const props = defineProps<{
  label: string; // 底部文字
}>();

const chartOptions = ref<EChartsOption>({
  backgroundColor: "transparent",
  grid: { top: 10, bottom: 10, left: 20, right: 20 },
  xAxis: { type: "value", show: false },
  yAxis: {
    type: "category",
    data: ["A", "B"],
    axisLine: { lineStyle: { width: 2 } },
  },
  series: [
    {
      type: "bar",
      barWidth: 16,
      data: [
        { value: 23, itemStyle: { color: "#5470c6" } },
        { value: 45, itemStyle: { color: "#91cc75" } },
      ],
      label: { show: true, position: "right" },
      itemStyle: { color: "#5470c6" },
    },
  ],
});
</script>
<template>
  <div class="flex flex-col items-center">
    <Echart :options="chartOptions" theme="dark" ref="chartRef" />
    <div class="text-[#ccc] text-[12px]">{{ props.label }}</div>
  </div>
</template>
