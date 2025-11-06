<script setup lang="ts">
import Echart from "@/components/common/Echart.vue";
import ChartHeader from "@/components/common/ChartHeader.vue";
import { ref } from "vue";

const chartRef = ref<HTMLDivElement | null>(null);

// 环境数据
const envData = ref({
  temperature: "26°C",
  pressure: "99kPa",
  humidity: "40%",
  windSpeed: "1.2m/s",
});

// 生成过去1小时到现在的数据
const generateData = () => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  const data = [];
  let currentTime = oneHourAgo;

  while (currentTime <= now) {
    // 生成随机压力数据，范围在 0-40kPa 之间
    const pressure = Math.random() * 40;
    data.push({
      time: currentTime.getTime(),
      pressure: pressure,
    });
    // 每分钟一个数据点
    currentTime = new Date(currentTime.getTime() + 60 * 1000);
  }

  return data;
};

const chartData = generateData();

const chartOptions: echarts.EChartsOption = {
  backgroundColor: "transparent",
  grid: { top: 20, right: 0, bottom: 20, left: 20 },
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
    min: new Date().getTime() - 60 * 60 * 1000, // 1小时前
    max: new Date().getTime(), // 现在
    // 控制刻度显示间隔
    interval: 20 * 60 * 1000, // 10分钟一个刻度
  },
  yAxis: {
    type: "value",
    name: "蒸汽冷凝压力/kPa",
    nameLocation: "middle",
    nameGap: 40,
    min: 0,
    max: 40,
    axisLine: { lineStyle: { color: "#ccc" } },
    axisLabel: { color: "#ccc" },
    splitLine: {
      lineStyle: { color: "rgba(255,255,255,0.3)", width: 1 },
    },
  },
  series: [
    {
      name: "蒸汽冷凝压力",
      type: "line",
      smooth: true,
      symbol: "none",
      lineStyle: { width: 2, color: "#5470c6" },
      data: chartData.map((item) => [item.time, item.pressure]),
    },
    {
      // 25kPa 虚线
      type: "line",
      markLine: {
        silent: true,
        lineStyle: {
          type: "dashed",
          color: "#ff4d4f",
          width: 1,
        },
        symbol: "none", // 去掉箭头
        data: [
          {
            yAxis: 25,
            label: {
              show: true,
              formatter: "25kPa",
              color: "#ff4d4f",
            },
          },
        ],
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
      const pressure = data.value[1].toFixed(2);
      return `时间:${time}<br/>压力: ${pressure} kPa`;
    },
  },
};
</script>

<template>
  <div class="w-full h-full">
    <ChartHeader title="冷端状态诊断" />
    <div class="frame-bg">
      <!-- 环境数据行 -->
      <div class="flex justify-between items-cente rounded-lg pt-2 mx-8">
        <div class="flex items-center space-x-2">
          <span class="text-blue-400">🌡️</span>
          <span class="text-white text-[14px]"
            >环境温度：{{ envData.temperature }}</span
          >
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-green-400">📊</span>
          <span class="text-white text-[14px]"
            >气压：{{ envData.pressure }}</span
          >
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-cyan-400">💧</span>
          <span class="text-white text-[14px]"
            >湿度：{{ envData.humidity }}</span
          >
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-yellow-400">💨</span>
          <span class="text-white text-[14px]"
            >风速：{{ envData.windSpeed }}</span
          >
        </div>
      </div>

      <div class="chart-box">
        <Echart :options="chartOptions" theme="dark" ref="chartRef" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-box {
  width: 90%;
  height: calc(100% - 45px);
}
.frame-bg {
  width: 100%;
  height: calc(100% - 30px);
  background-image: url("@/assets/picture/frame.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}
</style>
