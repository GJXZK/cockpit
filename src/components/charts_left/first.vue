<!-- 流量分配建议 -->
<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import Echart from "@/components/common/Echart.vue";
import ChartHeader from "@/components/common/ChartHeader.vue";

// 模拟静态折线数据
const planData_1 = [
  { total: 50, num: 40 },
  { total: 51, num: 40 },
  { total: 52, num: 40 },
  { total: 53, num: 40 },
  { total: 54, num: 40 },
  { total: 55, num: 27 },
  { total: 56, num: 29 },
  { total: 57, num: 34 },
  { total: 58, num: 41 },
  { total: 59, num: 42 },
  { total: 60, num: 44 },
  { total: 61, num: 45 },
  { total: 62, num: 47 },
  { total: 63, num: 60 },
  { total: 64, num: 40 },
  { total: 65, num: 40 },
  { total: 66, num: 40 },
  { total: 67, num: 40 },
  { total: 68, num: 40 },
  { total: 69, num: 40 },
  { total: 70, num: 40 },
  { total: 71, num: 40 },
  { total: 72, num: 40 },
  { total: 73, num: 40 },
];
const planData_2 = [
  { total: 50, num: 25 },
  { total: 51, num: 25 },
  { total: 52, num: 25 },
  { total: 53, num: 25 },
  { total: 54, num: 25 },
  { total: 55, num: 27 },
  { total: 56, num: 29 },
  { total: 57, num: 34 },
  { total: 58, num: 40 },
  { total: 59, num: 40 },
  { total: 60, num: 40 },
  { total: 61, num: 40 },
  { total: 62, num: 40 },
  { total: 63, num: 40 },
  { total: 64, num: 40 },
  { total: 65, num: 40 },
  { total: 66, num: 40 },
  { total: 67, num: 40 },
  { total: 68, num: 40 },
  { total: 69, num: 40 },
  { total: 70, num: 40 },
  { total: 71, num: 40 },
  { total: 72, num: 40 },
  { total: 73, num: 40 },
];
const seriesData_1 = planData_1.map((p) => [p.total, p.num]);
const seriesData_2 = planData_2.map((p) => [p.total, p.num]);

// 当前竖线位置索引
const currentTotal = ref(50);

const chartOptions = ref<echarts.EChartsOption>({
  backgroundColor: "transparent",
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "cross" },
  },

  xAxis: {
    type: "value",
    min: 50,
    max: 120,
    name: "总蒸汽流量 t/h",
    nameLocation: "middle",
    nameGap: 30,
    interval: 10,
    axisLine: { lineStyle: { color: "rgba(255,255,255,0.4)" } },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: "rgba(255,255,255,0)" } },
    axisLabel: { color: "#ccc" },
  },

  yAxis: {
    type: "value",
    name: "蒸汽分配策略 t/h",
    min: 25,
    max: 65,
    interval: 10,
    axisLine: { lineStyle: { color: "rgba(255,255,255,0)" } },
    splitLine: { lineStyle: { color: "rgba(255,255,255,0.2)" } },
    axisLabel: { color: "#ccc" },
  },
  legend: {
    data: ["1号机", "2号机"],
    textStyle: { color: "#ccc" },
    top: 0,
    right: "5%",
    icon: "circle",
  },
  grid: { top: 30, bottom: 20, left: 20, right: 20 },

  series: [
    {
      name: "1号机",
      type: "line",
      smooth: false,
      symbol: "none",
      lineStyle: { width: 3, color: "#1E90FF" },
      itemStyle: { color: "#1E90FF" },
      data: seriesData_1,
    },
    {
      name: "2号机",
      type: "line",
      smooth: false,
      symbol: "none",
      lineStyle: { width: 3, color: "#00FA9A" },
      itemStyle: { color: "#00FA9A" },
      data: seriesData_2,
    },
  ],
});

const chartRef = ref();

onMounted(() => {
  const chart = chartRef.value?.getInstance?.();
  if (!chart) return;

  const updateMarkLine = () => {
    chart.setOption(
      {
        series: [
          {
            name: "1号机",
            markLine: {
              symbol: "none",
              lineStyle: { color: "#ff4d4f", width: 2 },
              data: [{ xAxis: currentTotal.value }],
            },
          },
          {
            name: "2号机",
            markLine: {
              symbol: "none",
              lineStyle: { color: "#ff4d4f", width: 2 },
              data: [{ xAxis: currentTotal.value }],
            },
          },
        ],
      },
      false
    );
  };

  updateMarkLine();

  // 模拟实时更新竖线
  setInterval(() => {
    currentTotal.value = currentTotal.value >= 73 ? 50 : currentTotal.value + 1;
    updateMarkLine();
  }, 2000);
});
</script>
<template>
  <div class="w-full h-full">
    <ChartHeader title="流量分配建议" />
    <div class="mt-[5px] w-[80%] flex justify-between">
      <p class="text-white text-[14px]">目标功率:xxxxx</p>
      <p class="text-white text-[14px]">目标流量:xxxxx</p>
      <p class="text-white text-[14px]">流量建议:xxxxx</p>
    </div>
    <div class="chart-box pt-[10px]">
      <Echart :options="chartOptions" theme="dark" ref="chartRef" />
    </div>
  </div>
</template>
<style scoped>
.chart-box {
  width: 100%;
  height: calc(90% - 30px);
}
</style>
