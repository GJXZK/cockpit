<script setup lang="ts">
import Echart from "@/components/common/Echart.vue";
import type { EChartsOption } from "echarts";
import ChartHeader from "@/components/common/ChartHeader.vue";
import { ref } from "vue";

// 生成过去1小时到现在的数据
const generateData = () => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  const data = [];
  let currentTime = oneHourAgo;

  while (currentTime <= now) {
    // 生成HDI数据，模拟波动
    const hdi = 0.2 + Math.random() * 0.6;
    data.push({
      time: currentTime.getTime(),
      hdi: hdi,
    });
    // 每分钟一个数据点
    currentTime = new Date(currentTime.getTime() + 60 * 1000);
  }

  return data;
};

const chartData = generateData();

const chartOptions = ref<EChartsOption>({
  backgroundColor: "transparent",
  grid: { top: 20, right: 40, bottom: 20, left: 20 },
  xAxis: {
    type: "time",
    name: "时间/min",
    nameLocation: "middle",
    nameGap: 30,
    axisLine: { lineStyle: { color: "#ccc" } },
    axisLabel: {
      color: "#ccc",
      formatter: (value: number) => {
        const date = new Date(value);
        return `${date.getHours()}:${date
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
      },
    },
    min: new Date().getTime() - 60 * 60 * 1000,
    max: new Date().getTime(),
    interval: 10 * 60 * 1000, // 10分钟一个刻度
  },
  yAxis: {
    type: "value",
    name: "健康退化指数HDI",
    nameLocation: "middle",
    nameGap: 40,
    min: 0,
    max: 1,
    axisLine: { lineStyle: { color: "#ccc" } },
    splitLine: { lineStyle: { color: "rgba(255,255,255,0.2)" } },
    axisLabel: { color: "#ccc" },
  },
  series: [
    {
      type: "line",
      smooth: true,
      symbol: "none",
      lineStyle: { width: 2, color: "#5470c6" },
      data: chartData.map((item) => [item.time, item.hdi]),
    },
    {
      // 0.3阈值线
      type: "line",
      markLine: {
        silent: true,
        symbol: "none",
        lineStyle: {
          type: "dashed",
          color: "#faad14",
          width: 1,
        },
        label: { show: false },
        data: [{ yAxis: 0.3 }],
      },
    },
    {
      // 0.6阈值线
      type: "line",
      markLine: {
        silent: true,
        symbol: "none",
        lineStyle: {
          type: "dashed",
          color: "#ff7a45",
          width: 1,
        },
        label: { show: false },
        data: [{ yAxis: 0.6 }],
      },
    },
  ],
  tooltip: {
    trigger: "axis",
    formatter: (params: any) => {
      const data = params[0];
      const date = new Date(data.value[0]);
      const time = `${date.getHours()}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
      const hdi = data.value[1].toFixed(3);
      return `时间:${time}<br/>HDI: ${hdi}`;
    },
  },
});
</script>

<template>
  <div class="w-full h-full">
    <ChartHeader title="机组状态诊断" />

    <!-- HDI状态说明 -->
    <div
      class="flex justify-center items-center space-x-6 mx-2 mt-2"
    >
      <div class="flex items-center space-x-1">
        <span class="text-green-400">●</span>
        <span class="text-white text-[14px]">HDI 0-0.3 健康</span>
      </div>
      <div class="flex items-center space-x-1">
        <span class="text-yellow-400">●</span>
        <span class="text-white text-[14px]">HDI 0.3-0.6 异常</span>
      </div>
      <div class="flex items-center space-x-1">
        <span class="text-orange-400">●</span>
        <span class="text-white text-[14px]">HDI>0.6 预警</span>
      </div>
    </div>

    <div class="chart-box">
      <Echart :options="chartOptions" theme="dark" />
    </div>
  </div>
</template>

<style scoped>
.chart-box {
  width: 100%;
  height: calc(90% - 40px);
}
</style>
