<script setup lang="ts">
import Echart from "@/components/common/Echart.vue";
import type { EChartsOption } from "echarts";
import ChartHeader from "@/components/common/ChartHeader.vue";
import { ref, onMounted } from "vue";
import turbineService, {
  type UnitDiagnosisData,
} from "../../api/turbineService";

const unitDiagnosisData = ref<UnitDiagnosisData>();
const timeLabels = ref<string[]>([]);

const getUnitDiagnosis = async () => {
  unitDiagnosisData.value = await turbineService.getUnitDiagnosis();
};

const chartOptions = ref<EChartsOption>({
  backgroundColor: "transparent",
  grid: { top: 20, right: 40, bottom: 20, left: 20 },
  xAxis: [
    {
      // 长刻度轴（显示标签的位置）
      type: "category",
      position: "bottom",
      name: "时间/min",
      nameLocation: "middle",
      nameGap: 30,
      axisLine: { lineStyle: { color: "#ccc" } },
      axisTick: {
        show: true,
        alignWithLabel: true,
        interval: 19,
        length: 5,
        lineStyle: { color: "#ccc" },
      },
      axisLabel: {
        color: "#ccc",
        interval: 19,
        showMaxLabel: true,
      },
      data: [],
    },
    {
      // 短刻度轴（所有位置）
      type: "category",
      position: "bottom",
      axisLine: { show: false },
      axisTick: {
        show: true,
        alignWithLabel: true,
        interval: 0,
        length: 3,
        lineStyle: { color: "#ccc" },
      },
      axisLabel: { show: false },
      data: [],
    },
  ],
  yAxis: {
    type: "value",
    name: "健康退化指数HDI",
    nameLocation: "middle",
    nameGap: 40,
    min: 0,
    max: 1,
    interval: 0.1,
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
      data: [],
    },
    {
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
      const time = data.name;
      const hdi = data.value.toFixed(3);
      return `时间:${time}<br/>HDI: ${hdi}`;
    },
  },
});

// 处理数据函数
const processChartData = () => {
  let hdiData: number | any[] = [];
  if (unitDiagnosisData.value) {
    hdiData = unitDiagnosisData.value.health_degradation_index;
  }

  const now = new Date();
  const validData = [];
  const labels = [];

  for (let i = hdiData.length - 1; i >= 0; i--) {
    const hdi = hdiData[i];
    if (hdi !== null && hdi !== undefined) {
      const time = new Date(now.getTime() - i * 60000);
      labels.push(
        time.toLocaleTimeString("zh-CN", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      validData.push(hdi);
    }
  }

  timeLabels.value = labels;

  // 更新两个x轴的数据
  const xAxis = chartOptions.value.xAxis as any[];
  if (xAxis && Array.isArray(xAxis)) {
    if (xAxis[0]) xAxis[0].data = timeLabels.value;
    if (xAxis[1]) xAxis[1].data = timeLabels.value;
  }

  if (chartOptions.value.series && Array.isArray(chartOptions.value.series)) {
    const series0 = chartOptions.value.series[0] as any;
    if (series0) series0.data = validData;
  }
};

onMounted(async () => {
  await getUnitDiagnosis();
  processChartData();
});
</script>

<template>
  <div class="w-full h-full">
    <ChartHeader title="机组状态诊断" />
    <div class="frame-bg">
      <!-- HDI状态说明 -->
      <div class="flex justify-center items-center space-x-6 mx-2 pt-2">
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
  </div>
</template>

<style scoped>
.chart-box {
  width: 100%;
  height: calc(100% - 40px);
}
.frame-bg {
  width: 100%;
  height: calc(100% - 35px);
  background-image: url("@/assets/picture/frame.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}
</style>
