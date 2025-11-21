<script setup lang="ts">
import Echart from "@/components/common/Echart.vue";
import type { EChartsOption } from "echarts";
import ChartHeader from "@/components/common/ChartHeader.vue";
import { onMounted, ref, watch } from "vue";
import turbineService, {
  type ThermalEfficiencyTrendData,
} from "@/api/turbineService.ts";
import { refreshSignal } from "@/util/eventBus";


const thermalEfficiencyTrendData = ref<ThermalEfficiencyTrendData>();
const timeLabels = ref<string[]>([]);

const getThermalEfficiencyTrend = async () => {
  thermalEfficiencyTrendData.value =
    await turbineService.getThermalEfficiencyTrend();
};
// 监听刷新信号
watch(refreshSignal, async () => {
  console.log('接收到刷新信号，更新数据...');
  await getThermalEfficiencyTrend();
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
      position: "bottom",
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
    name: "%",
    axisLine: { lineStyle: { color: "#999" } },
    splitLine: { lineStyle: { color: "rgba(255,255,255,0.2)" } },
    axisLabel: { color: "#ccc" },
  },
  series: [
    {
      name: "1#机实时发电效率",
      type: "line",
      smooth: true,
      symbol: "none",
      lineStyle: {
        color: "#5cb85c",
        width: 4,
      },
      data: [],
      itemStyle: {
        color: "#5cb85c",
      },
    },
    {
      name: "投用前平均发电效率",
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
    data: ["1#机实时发电效率", "投用前平均发电效率"],
    top: 0,
    textStyle: { color: "#ccc" },
  },
});

// 处理数据函数
const processChartData = () => {
  let efficiencies: number[] = [];
  if (thermalEfficiencyTrendData.value) {
    efficiencies = thermalEfficiencyTrendData.value.thermal_efficiencies;
  }

  // 同时处理数据和时间，过滤掉null值
  const now = new Date();
  const validData = [];
  const labels = [];

  for (let i = efficiencies.length - 1; i >= 0; i--) {
    const efficiency = efficiencies[i];
    if (efficiency !== null && efficiency !== undefined) {
      const time = new Date(now.getTime() - i * 60000); // 每分钟间隔
      labels.push(
        time.toLocaleTimeString("zh-CN", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      validData.push(efficiency * 100);
    }
  }

  timeLabels.value = labels;

  // 静态标杆值
  const benchmarkValue = 28;

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
  await getThermalEfficiencyTrend();
  processChartData();
});
</script>
<template>
  <div class="w-full h-full">
    <ChartHeader title="机组发电效率趋势" />
    <div class="pt-[10px] frame-bg">
      <Echart :options="chartOptions" theme="dark" ref="chartRef" />
    </div>
  </div>
</template>
<style scoped>
.frame-bg {
  width: 98%;
  height: calc(100% - 40px);
  background-image: url("@/assets/picture/frame.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}
</style>
