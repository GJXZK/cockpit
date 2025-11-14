<script setup lang="ts">
import Echart from "@/components/common/Echart.vue";
import type { EChartsOption } from "echarts";
import ChartHeader from "@/components/common/ChartHeader.vue";
import { ref, onMounted } from "vue";
import turbineService, {
  type HeatRateTrendData,
} from "../..//api/turbuneService";

let heatRateTrendData = ref<HeatRateTrendData>();
const timeLabels = ref<string[]>([]);

const getThermalEfficiencyTrend = async () => {
  heatRateTrendData.value = await turbineService.getHeatRateTrend();
};

const chartOptions = ref<EChartsOption>({
  backgroundColor: "transparent",
  grid: { top: 30, bottom: 30, left: 20, right: 40 },
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
        interval: 19, // 每20分钟显示一个标签
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
    }
  ],
  yAxis: {
    type: "value",
    name: "kJ/kWh",
    min: 5500,
    max: 12500,
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
      data: [],
      itemStyle:{
        color:"#5cb85c"
      }
    },
    {
      name: "1#机热耗标杆",
      type: "line",
      data: [],
      lineStyle: {
        color: "#ff0000",
        width: 3,
        type: "dashed",
      },
      symbol: "none",
      itemStyle:{
        color:'#ff0000'
      }
    },
  ],
  legend: {
    data: ["1#机实时热耗", "1#机热耗标杆"],
    top: 0,
    textStyle: { color: "#ccc" },
  },
});

// 处理数据函数
const processChartData = () => {
  let efficiencies: number | any[] = [];
  if (heatRateTrendData.value) {
    efficiencies = heatRateTrendData.value.heat_rates;
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
      validData.push(efficiency);
    }
  }

  timeLabels.value = labels;

  // 静态标杆值
  const benchmarkValue = 10000;

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
