<script setup lang="ts">
import Echart from "@/components/common/Echart.vue";
import type { EChartsOption } from "echarts";
import ChartHeader from "@/components/common/ChartHeader.vue";
import { ref, onMounted, watch } from "vue";
import turbineService, {
  type SteamRateTrendData,
} from "@/api/turbineService.ts";
import { refreshSignal } from "@/util/eventBus";

const steamRateTrendData = ref<SteamRateTrendData>();
const timeLabels = ref<string[]>([]);

const getSteamRateTrend = async () => {
  steamRateTrendData.value = await turbineService.getSteamRateTrend();
};
watch(refreshSignal, async () => {
  console.log('接收到刷新信号，更新数据...');
  await getSteamRateTrend();
});

const chartOptions = ref<EChartsOption>({
  backgroundColor: "transparent",
  grid: { top: 30, bottom: 30, left: 40, right: 40 },
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "line" },
  },
  xAxis: [
    {
      // 长刻度轴（显示标签的位置）
      type: "category",
      boundaryGap: false,
      axisLine: {
        lineStyle: { color: "#999" },
      },
      axisLabel: {
        color: "#ccc",
        interval: 19,
        showMaxLabel: true,
      },
      axisTick: {
        show: true,
        alignWithLabel: true,
        interval: 19, // 每20个数据显示一个长刻度
        length: 5, // 长刻度
      },
      data: [],
    },
    {
      // 短刻度轴（所有位置）
      type: "category",
      boundaryGap: false,
      position: "bottom",
      axisLine: { show: false },
      axisLabel: { show: false },
      axisTick: {
        show: true,
        alignWithLabel: true,
        interval: 0, // 每个数据点都显示短刻度
        length: 2, // 短刻度
      },
      data: [],
    },
  ],
  yAxis: {
    type: "value",
    name: "kJ/kWh",
    axisLine: { lineStyle: { color: "#999" } },
    splitLine: { lineStyle: { color: "rgba(255,255,255,0.2)" } },
    axisLabel: { color: "#ccc" },
  },
  series: [
    {
      name: "1#机实时汽耗",
      type: "line",
      smooth: true,
      symbol: "none",
      lineStyle: {
        color: "#5cb85c",
        width: 3,
      },
      itemStyle: {
        color: "#5cb85c",
      },
      data: [],
    },
    {
      name: "1#机汽耗标杆",
      type: "line",
      data: [],
      lineStyle: {
        color: "#ff0000",
        width: 3,
        type: "dashed",
      },
      symbol: "none",
      itemStyle: {
        color: "#ff0000",
      },
    },
  ],
  legend: {
    data: ["1#机实时汽耗", "1#机汽耗标杆"],
    top: 0,
    textStyle: { color: "#ccc" },
    formatter: function (name: string) {
      return `${name}`;
    },
  },
});

// 处理数据函数
const processChartData = () => {
  let steamRates: number | any[] = [];
  if (steamRateTrendData.value) {
    steamRates = steamRateTrendData.value.steam_rates;
  }

  // 同时处理数据和时间，过滤掉null值
  const now = new Date();
  const validData = [];
  const labels = [];

  for (let i = steamRates.length - 1; i >= 0; i--) {
    const steamRate = steamRates[i];
    if (steamRate !== null && steamRate !== undefined) {
      const time = new Date(now.getTime() - i * 60000); // 每分钟间隔
      labels.push(
        time.toLocaleTimeString("zh-CN", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      validData.push(steamRate);
    }
  }

  timeLabels.value = labels;

  // 静态标杆值
  const benchmarkValue = 4;

  // 安全更新图表数据
  const xAxis = chartOptions.value.xAxis as any[];
  if (xAxis && Array.isArray(xAxis)) {
    if (xAxis[0]) xAxis[0].data = timeLabels.value;
    if (xAxis[1]) xAxis[1].data = timeLabels.value;
  }

  if (chartOptions.value.series && Array.isArray(chartOptions.value.series)) {
    const series0 = chartOptions.value.series[0] as any;
    const series1 = chartOptions.value.series[1] as any;

    if (series0) series0.data = validData;
    if (series1)
      series1.data = new Array(validData.length).fill(benchmarkValue);
  }
};

onMounted(async () => {
  await getSteamRateTrend();
  processChartData();
});
</script>
<template>
  <div class="w-full h-full">
    <ChartHeader title="汽耗趋势" />
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
