<script setup lang="ts">
import Echart from "@/components/common/Echart.vue";
import ChartHeader from "@/components/common/ChartHeader.vue";
import { onMounted, ref } from "vue";
import turbineService, {
  type ColdEndDiagnosisData,
} from "../../api/turbineService";

let coldEndOptimization = ref<ColdEndDiagnosisData>();
const timeLabels = ref<string[]>([]);

const getColdEndDiagnosis = async () => {
  coldEndOptimization.value = await turbineService.getColdEndDiagnosis();
};
const chartRef = ref<HTMLDivElement | null>(null);

// 处理图表数据函数
const processChartData = () => {
  if (!coldEndOptimization.value?.actual_values)
    return { timeLabels: [], pressureData: [] };

  const actualValues = coldEndOptimization.value.actual_values;
  const now = new Date();

  // 生成时间轴和数据
  const labels = [];
  const pressureData = [];
  for (let i = actualValues.length - 1; i >= 0; i--) {
    const value = actualValues[i];
    if (value !== null && value !== undefined) {
      const time = new Date(now.getTime() - i * 60000); // 每分钟间隔
      labels.push(
        time.toLocaleTimeString("zh-CN", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      pressureData.push(value);
    }
  }

  timeLabels.value = labels;
  return { timeLabels: labels, pressureData };
};

const chartOptions = ref({
  backgroundColor: "transparent",
  grid: { top: 20, right: 0, bottom: 20, left: 20 },
  xAxis: [
    {
      // 长刻度轴（显示标签的位置）
      type: "category",
      name: "时间/min",
      nameLocation: "middle",
      nameGap: 30,
      axisLine: { lineStyle: { color: "#ccc" } },
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
    name: "蒸汽冷凝压力/kPa",
    nameLocation: "middle",
    nameGap: 40,
    min: 0,
    max: 80,
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
      data: [],
    },
    {
      type: "line",
      markLine: {
        silent: true,
        lineStyle: {
          type: "dashed",
          color: "#ff4d4f",
          width: 1,
        },
        symbol: "none",
        data: [
          {
            yAxis: 25,
            label: {
              show: true,
              formatter: "25",
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
      const time = data.name;
      const pressure = data.value.toFixed(2);
      return `时间:${time}<br/>压力: ${pressure} kPa`;
    },
  },
});

// 数据加载后更新图表
onMounted(async () => {
  await getColdEndDiagnosis();

  if (coldEndOptimization.value?.actual_values) {
    const { pressureData } = processChartData();
    const xAxis = chartOptions.value.xAxis as any[];
    const series = chartOptions.value.series as any[];

    if (xAxis && Array.isArray(xAxis)) {
      if (xAxis[0]) xAxis[0].data = timeLabels.value;
      if (xAxis[1]) xAxis[1].data = timeLabels.value;
    }

    if (series[0]) {
      series[0].data = pressureData;
    }
  }
});
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
            >环境温度：{{ coldEndOptimization?.ambient_temperature }}</span
          >
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-green-400">📊</span>
          <span class="text-white text-[14px]"
            >气压：{{ coldEndOptimization?.air_pressure }}</span
          >
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-cyan-400">💧</span>
          <span class="text-white text-[14px]"
            >湿度：{{ coldEndOptimization?.humidity }}</span
          >
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-yellow-400">💨</span>
          <span class="text-white text-[14px]"
            >风速：{{ coldEndOptimization?.wind_speed }}</span
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
