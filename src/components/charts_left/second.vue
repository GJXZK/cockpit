<script setup lang="ts">
import ChartHeader from "@/components/common/ChartHeader.vue";
import SecondChild from "./second_child.vue";
import turbineService, {
  type AutoParameterOptimizationData,
} from "@/api/turbineService.ts";
import { onMounted, ref, watch } from "vue";
import { refreshSignal } from "@/util/eventBus";

const props = withDefaults(defineProps<{ mid?: number }>(), {
  mid: 1
});

const autoParameterOptimizationData = ref<AutoParameterOptimizationData>();
const getAutoParameterOptimization = async () => {
  autoParameterOptimizationData.value =
    await turbineService.getAutoParameterOptimization(props.mid);
};
watch(refreshSignal, async () => {
  console.log('接收到刷新信号，更新数据...');
  await getAutoParameterOptimization();
});

const getBenchmark = (index: number): number => {
  return (
    autoParameterOptimizationData.value?.optimization_params[index]?.[2] || 0
  );
};

const getActual = (index: number): number => {
  return (
    autoParameterOptimizationData.value?.optimization_params[index]?.[1] || 0
  );
};
onMounted(() => {
  getAutoParameterOptimization();
});
</script>
<template>
  <div class="w-full h-full">
    <ChartHeader title="运行参数自主寻优" />
    <div class="frame-bg flex flex-col">
      <!-- HDI状态说明 -->
      <div class="flex justify-end items-center space-x-6 mr-[40px]">
        <div class="flex items-center space-x-1">
          <span class="text-[#9fe080]">●</span>
          <span class="text-white text-[14px]">实际值</span>
        </div>
        <div class="flex items-center space-x-1">
          <span class="text-[#5470c6]">●</span>
          <span class="text-white text-[14px]">标杆值</span>
        </div>
      </div>

      <div class="flex-1">
        <div class="w-full h-[50%] flex">
          <SecondChild
            :benchmark="getBenchmark(0)"
            :actual="getActual(0)"
            label="主蒸汽温度"
            class="h-full w-full"
          />
          <SecondChild
            :benchmark="getBenchmark(1)"
            :actual="getActual(1)"
            label="主蒸汽压力"
            class="h-full w-full"
          />
          <SecondChild
            :benchmark="getBenchmark(2)"
            :actual="getActual(2)"
            label="低压加热器端差"
            class="h-full w-full"
          />
        </div>
        <div class="w-full h-[50%] flex">
          <SecondChild
            :benchmark="getBenchmark(3)"
            :actual="getActual(3)"
            label="过冷度偏差"
            class="h-full w-full"
          />
          <SecondChild
            :benchmark="getBenchmark(4)"
            :actual="getActual(4)"
            label="冷凝器端差"
            class="h-full w-full"
          />
          <SecondChild
            :benchmark="getBenchmark(5)"
            :actual="getActual(5)"
            label="凝汽器真空"
            class="h-full w-full"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.frame-bg {
  width: 100%;
  height: calc(100% - 30px);
  background-image: url("@/assets/picture/frame.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}
</style>
