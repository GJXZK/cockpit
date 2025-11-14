<script setup lang="ts">
import Echart from "@/components/common/Echart.vue";
import type { EChartsOption } from "echarts";
import { computed } from "vue";
import toFixedTwo from "@/util/utils.ts";

const props = defineProps<{
  label: string; // 底部文字
  benchmark?: number;
  actual?: number;
}>();

// 使用计算属性，当 props 变化时自动更新
const chartOptions = computed<EChartsOption>(() => {
  // 将负值转换为正值显示，但保留原始值用于标签显示
  const benchmarkValue = props.benchmark || 0;
  const actualValue = props.actual || 0;
  
  return {
    backgroundColor: "transparent",
    grid: { top: 10, bottom: 10, left: 20, right:35 },
    xAxis: { 
      type: "value", 
      show: false,
      min: 0 // 强制从0开始，确保柱子始终向右
    },
    yAxis: {
      type: "category",
      data: ["标\n杆\n值", "实\n际\n值"],
      axisLine: { lineStyle: { width: 2 } },
    },
    series: [
      {
        type: "bar",
        barWidth: 16,
        data: [
          { 
            value: Math.abs(benchmarkValue), 
            itemStyle: { color: "#5470c6" },
            label: {
              show: true,
              position: "right",
              formatter: () => toFixedTwo(benchmarkValue).toString(),
              overflow: 'truncate', // 添加溢出处理
              width:500 // 设置标签宽度
            }
          },
          { 
            value: Math.abs(actualValue), 
            itemStyle: { color: "#91cc75" },
            label: {
              show: true,
              position: "right", 
              formatter: () => toFixedTwo(actualValue).toString()
            }
          },
        ],
      },
    ],
  };
});
</script>

<template>
  <div class="flex flex-col items-center">
    <Echart :options="chartOptions" theme="dark" />
    <div class="text-[#ccc] text-[12px]">{{ props.label }}</div>
  </div>
</template>