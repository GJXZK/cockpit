<!-- 流量分配建议 -->
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import * as echarts from "echarts";
import Echart from "@/components/common/Echart.vue";
import ChartHeader from "@/components/common/ChartHeader.vue";
import toFixedTwo from "@/util/utils.ts";
import turbineService, { type FlowAdviceData } from "../..//api/turbuneService";

// 响应式数据
let flowAdviceData = ref<FlowAdviceData>();
const currentTotal = ref(0);

// 处理后的图表数据
const seriesData_1 = ref<[number, number][]>([]);
const seriesData_2 = ref<[number, number][]>([]);

// 获取数据
const flowAdvice = async () => {
  flowAdviceData.value = await turbineService.getFlowAdvice();
  console.log(flowAdviceData.value);

  if (flowAdviceData.value) {
    const {
      total_flow_series,
      unit1_flow_series,
      unit2_flow_series,
      total_steam_flow,
    } = flowAdviceData.value;

    // 处理 unit1 数据，null 替换为 0
    seriesData_1.value = total_flow_series.map((total, index) => [
      total,
      unit1_flow_series[index] === null ? 0 : unit1_flow_series[index],
    ]);

    // 处理 unit2 数据，null 替换为 0
    seriesData_2.value = total_flow_series.map((total, index) => [
      total,
      unit2_flow_series[index] === null ? 0 : unit2_flow_series[index],
    ]);

    // 设置竖线位置为后端返回的 total_steam_flow
    currentTotal.value = total_steam_flow;

    // 更新图表
    updateChart();
  }
};

const chartOptions = ref<echarts.EChartsOption>({
  backgroundColor: "transparent",
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "cross" },
  },

  xAxis: [
    {
      // 长刻度轴（显示标签的位置）
      type: "value",
      position: "bottom",
      name: "总蒸汽流量 t/h",
      nameLocation: "middle",
      nameGap: 25,
      min: 40,
      max: 90,
      axisLine: {
        lineStyle: { color: "rgba(255,255,255,0.4)" },
      },
      axisLabel: {
        color: "#ccc",
        // 只在10的倍数位置显示标签
        interval: (index: number, value: number) => {
          return value % 10 === 0;
        },
      },
      axisTick: {
        show: true,
        // 只在10的倍数位置显示长刻度
        interval: (index: number, value: number) => {
          return value % 10 === 0;
        },
        length: 6, // 长刻度长度
        lineStyle: {
          color: "rgba(255,255,255,0.8)",
        },
      },
      splitLine: { show: false },
    },
    {
      // 短刻度轴（所有位置）- 使用value类型
      type: "value",
      position: "bottom",
      min: 40,
      max: 90,
      axisLine: { show: false },
      axisLabel: { show: false },
      axisTick: {
        show: true,
        interval: 1, // 每个位置都显示
        length: 3, // 短刻度长度
        lineStyle: {
          color: "rgba(255,255,255,0.3)",
        },
      },
      splitLine: { show: false },
      data:[]
    },
  ],

  yAxis: {
    type: "value",
    name: "蒸\n汽\n分\n配\n策\n略\n t/h",
    nameLocation: "middle",
    nameRotate: 0,
    min: 20,
    max: 50,
    interval: 5,
    axisLine: { lineStyle: { color: "rgba(255,255,255,0)" } },
    axisTick: {
      show: true,
      length: 4,
      lineStyle: { color: "rgba(255,255,255,0.4)" },
    },
    splitLine: {
      lineStyle: { color: "rgba(255,255,255,0.2)" },
    },
    axisLabel: { color: "#ccc" },
  },

  legend: {
    data: ["1号机", "2号机"],
    textStyle: { color: "#ccc" },
    top: 0,
    right: "5%",
    icon: "circle",
  },

  grid: {
    top: 30,
    bottom: 30,
    left: 20,
    right: 20,
  },

  series: [
    {
      name: "1号机",
      type: "line",
      smooth: false,
      symbol: "none",
      lineStyle: { width: 3, color: "#1E90FF" },
      itemStyle: { color: "#1E90FF" },
      data: seriesData_1.value,
      xAxisIndex: 0, // 使用第一个x轴
    },
    {
      name: "2号机",
      type: "line",
      smooth: false,
      symbol: "none",
      lineStyle: { width: 3, color: "#00FA9A" },
      itemStyle: { color: "#00FA9A" },
      data: seriesData_2.value,
      xAxisIndex: 0, // 使用第一个x轴
    },
    // ✅ 新增：让第二个 xAxis 有数据，短刻度才会渲染
    {
      name: "_dummy",
      type: "line",
      data: seriesData_1.value.map(([x]) => [x, 0]),
      xAxisIndex: 1,
      symbol: "none",
      lineStyle: { opacity: 0 },
      itemStyle: { opacity: 0 },
      silent: true,
      z: -1,
    },
  ],
});

const chartRef = ref();

const updateChart = () => {
  const chart = chartRef.value?.getInstance?.();
  if (!chart) return;

  chart.setOption(
    {
      xAxis: [
        {}, // 第一个 xAxis 不变
        {
          // ✅ 重新触发第二个 xAxis 的刻度渲染
          axisTick: {
            show: true,
            interval: 0,
            length: 3,
            lineStyle: {
              color: "rgba(255,255,255,0.3)",
            },
          },
        },
      ],
      series: [
        {
          name: "1号机",
          data: seriesData_1.value,
          markLine: {
            symbol: "none",
            lineStyle: { color: "#ff4d4f", width: 2 },
            data: [{ xAxis: currentTotal.value }],
          },
        },
        {
          name: "2号机",
          data: seriesData_2.value,
          markLine: {
            symbol: "none",
            lineStyle: { color: "#ff4d4f", width: 2 },
            data: [{ xAxis: currentTotal.value }],
          },
        },
        // ✅ dummy 系列：必须有数据，才能触发 xAxisIndex:1 的刻度
        {
          name: "_dummy",
          type: "line",
          data: seriesData_1.value.map(([x]) => [x, 0]),
          xAxisIndex: 1,
          symbol: "none",
          lineStyle: { opacity: 0 },
          itemStyle: { opacity: 0 },
          silent: true,
          z: -1,
        },
      ],
    },
    false // 不是合并，而是局部刷新
  );
};
onMounted(() => {
  flowAdvice();
});

// 监听数据变化，自动更新图表
watch([seriesData_1, seriesData_2], () => {
  updateChart();
});
</script>

<template>
  <div class="w-full h-full">
    <ChartHeader title="流量分配建议" />

    <div class="frame-bg">
      <div class="mx-5 pt-2 flex justify-between">
        <p class="text-white text-[14px]">
          目标功率:{{ toFixedTwo(flowAdviceData?.target_power) }}
        </p>
        <p class="text-white text-[14px]">
          目标流量:{{ toFixedTwo(flowAdviceData?.target_flow) }}
        </p>
        <p class="text-white text-[14px]">
          流量建议:{{ flowAdviceData?.suggestion }}
        </p>
      </div>
      <div class="chart-box pt-[10px]">
        <Echart :options="chartOptions" theme="dark" ref="chartRef" />
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
