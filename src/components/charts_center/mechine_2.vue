<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";
import Echart from "@/components/common/Echart.vue";

const chartOptions = ref<echarts.EChartsOption>({
  backgroundColor: "transparent",
  series: [
    {
      type: "gauge",
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 100,
      splitNumber: 20,
      radius: "100%",
      center: ["50%", "70%"],
      axisLine: {
        lineStyle: {
          width: 12,
          color: [
            [0.6, "#52c41a"],
            [0.75, "#faad14"], // 0-60  绿色
            [1, "#ff7a45"], // 60-75 黄色
          ],
        },
      },
      pointer: {
        itemStyle: {
          color: "#00FA9A",
        },
        length: "70%",
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        color: "#ccc",
        fontSize: 10,
        distance: -35,
        formatter: (value: number) => {
          // 只显示 60 和 75
          if (value === 60 || value === 75) {
            return value.toString();
          }
          return "";
        },
      },
      detail: {
        valueAnimation: true,
        formatter: "{value}",
        color: "#00FA9A",
        fontSize: 24,
        offsetCenter: ["40%", "30%"],
      },
      data: [
        {
          value: 60, // 实时值
          name: `蒸汽流量 t/h`,
          title: {
            show: true,
            offsetCenter: ["-30%", "30%"],
            fontSize: 14,
            color: "#ccc",
          },
        },
      ],
    },
  ]
});

const chartRef = ref();
let timer: number | null = null;
onMounted(() => {
  const chart = chartRef.value?.getInstance?.();
  if (!chart) return;

  setInterval(() => {
    const v = 60 + Math.floor(Math.random() * 31);
    chart.setOption({
      series: [
        {
          data: [
            {
              value: v,
              name: "蒸汽流量  t/h",
              title: {
                show: true,
                offsetCenter: ["-30%", "30%"],
                fontSize: 14,
                color: "#ccc",
              },
            },
          ],
        },
      ],
    });
  }, 2000);
});
onUnmounted(() => {
  timer && window.clearInterval(timer);
});
</script>

<template>
  <div class="w-full  flex justify-center">
    <div class="chart-box">
      <Echart :options="chartOptions" theme="dark" ref="chartRef" />
    </div>
  </div>
</template>

<style scoped>
.chart-box {
  width: 80%;
  height: 200px;
}
</style>
