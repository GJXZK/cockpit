<script setup lang="ts">
import Echart from "@/components/common/Echart.vue";
import type { EChartsOption } from "echarts";
import ChartHeader from "@/components/common/ChartHeader.vue";
import { ref } from "vue";

const chartOptions = ref<EChartsOption>({
  backgroundColor: "transparent",
  grid: { top: 30, bottom: 30, left: 20, right: 40 },
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "line" },
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: [
      "16:00:00",
      "16:10:00",
      "16:20:00",
      "16:30:00",
      "16:40:00",
      "16:50:00",
      "17:00:00",
    ],
    axisLine: {
      lineStyle: { color: "#999" },
    },
    axisLabel: { color: "#ccc" },
  },
  yAxis: {
    type: "value",
    name: "kJ/kWh",
    min:8500,
    max:12500,
    interval: 1000,
    axisLine: { lineStyle: { color: "#999" } },
    splitLine: { lineStyle: { color: "rgba(255,255,255,0.2)" } },
    axisLabel: { color: "#ccc" },
  },
  series: [
    {
      name: "1#机实时热耗",
      type: "line",
      smooth: true,
      symbol: "none",
      lineStyle: {
        color: "#5cb85c",
        width: 4,
      },
      data: [9000, 9500, 12000, 10000, 10000, 10000, 10000],
    },
    {
      name: "1#机热耗标杆",
      type: "line",
      data: new Array(7).fill( 10000), // 水平参考线
      lineStyle: {
        color: "#5cb85c",
        width: 3,
        type: "dashed",
      },
      symbol: "none",
    },
  ],
  legend: {
    data: ["1#机实时热耗", "1#机热耗标杆"],
    top: 0,
    textStyle: { color: "#ccc" },
  },
});
</script>
<template>
  <div class="w-full h-full">
    <ChartHeader title="热耗趋势" />
    <div class="chart-box pt-[10px] frame-bg">
      <Echart :options="chartOptions" theme="dark" ref="chartRef" />
    </div>
  </div>
</template>
<style scoped>
.chart-box {
  width: 100%;
  height: 80%;
}
.frame-bg {
  width: 100%;
  height: calc(100% - 40px);
  background-image: url("@/assets/picture/frame.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}
</style>
