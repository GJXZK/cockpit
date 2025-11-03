  <template>
    <div ref="chartRef" class="echart-container"></div>
  </template>

  <script setup lang="ts">
  import * as echarts from 'echarts'
  import 'echarts-liquidfill'  
  import { onMounted, onBeforeUnmount, ref, watch, nextTick } from 'vue'

  interface Props {
    /** 图表配置项 */
    options: any
    /** 主题，可选 'light' | 'dark' */
    theme?: string
    /** 是否开启自适应大小 */
    autoResize?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    theme: 'light',
    autoResize: true,
  })

  const chartRef = ref<HTMLDivElement | null>(null)
  let chartInstance: echarts.ECharts | null = null

  /** 初始化图表 */
  const initChart = () => {
    if (!chartRef.value) return
    chartInstance = echarts.init(chartRef.value, props.theme)
    chartInstance.setOption(props.options)
  }

  /** 监听配置项变化，实时更新 */
  watch(
    () => props.options,
    (newOptions) => {
      if (chartInstance && newOptions) {
        chartInstance.setOption(newOptions, true)
      }
    },
    { deep: true }
  )

  /** 监听主题变化（如果切换了 dark/light） */
  watch(
    () => props.theme,
    async () => {
      if (!chartRef.value || !chartInstance) return
      chartInstance.dispose()
      await nextTick()
      initChart()
    }
  )

  /** 自适应窗口变化 */
  const resizeHandler = () => {
    chartInstance?.resize()
  }

  onMounted(() => {
    initChart()
    if (props.autoResize) {
      window.addEventListener('resize', resizeHandler)
    }
  })

  onBeforeUnmount(() => {
    chartInstance?.dispose()
    if (props.autoResize) {
      window.removeEventListener('resize', resizeHandler)
    }
  })

  /** 向外暴露实例 */
  defineExpose({
    getInstance: () => chartInstance,
  })
  </script>

  <style scoped>
  .echart-container {
    width: 100%;
    height: 100%;
  }
  </style>
