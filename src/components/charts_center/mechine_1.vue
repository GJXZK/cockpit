<script setup lang="ts">
import { ref, onMounted , watch } from "vue";
import * as echarts from "echarts";
import Echart from "@/components/common/Echart.vue";

// 定义组件接口
interface Props {
  value: number; // 动态输入的值
}

// 定义组件属性
const props = defineProps<Props>();

// 响应式数据
const chartOptions = ref<echarts.EChartsOption>({
  backgroundColor: "transparent",
  series: [
    {
      type: "gauge",
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 40,
      splitNumber: 4,
      radius: "100%",
      center: ["50%", "70%"],
      axisLine: {
        lineStyle: {
          width: 12,
          color: [
            [0.25, "#52c41a"],
            [0.5, "#faad14"], 
            [0.75, "#ff7a45"],
            [1, "#ff0202"], 
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
          value: props.value, // 使用外部传入的值
          name: `汽机振动 µm`,
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

const chartRef = ref();

// 监听 value 变化，更新图表
watch(() => props.value, (newValue) => {
  const chart = chartRef.value?.getInstance?.();
  if (chart) {
    chart.setOption({
      series: [
        {
          data: [
            {
              value: newValue,
              name: "汽机振动 µm", 
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
  }
});

// 移除原有的定时器，因为现在值由外部控制
onMounted(() => {
  // 初始设置一次值
  const chart = chartRef.value?.getInstance?.();
  if (chart) {
    chart.setOption({
      series: [
        {
          data: [
            {
              value: props.value,
              name: "汽机振动 µm", 
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
  }
});

</script>

<template>
  <div class="w-full flex justify-center">
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