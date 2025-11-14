<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
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
      min: -8,
      max: 8,
      splitNumber: 16, // 增加分割数量
      radius: "100%",
      center: ["50%", "70%"],
      axisLine: {
        lineStyle: {
          width: 12,
          color: [
            [0.5, "#ff7a45"],
            [1, "#52c41a"],
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
        show: false,
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
          name: `发电效率提升 %`,
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
              name: "发电效率提升 %",
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

// 初始设置
onMounted(() => {
  const chart = chartRef.value?.getInstance?.();
  if (chart) {
    chart.setOption({
      series: [
        {
          data: [
            {
              value: props.value,
              name: "发电效率提升 %",
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

onUnmounted(() => {
  // 清理工作
});
</script>

<template>
  <div class="w-full flex justify-center relative">
    <div class="chart-box">
      <Echart :options="chartOptions" theme="dark" ref="chartRef" />
    </div>
    <!-- 手动添加标签 - 沿着圆弧分布 -->
    <div class="absolute bottom-[40%] left-[2%] text-white text-[14px]">-8</div>
    <div class="absolute bottom-[85%] left-[48%] text-white text-[14px]">0</div>
    <div class="absolute bottom-[40%] right-[2%] text-white text-[14px]">8</div>
  </div>
</template>

<style scoped>
.chart-box {
  width: 80%;
  height: 200px;
}
</style>