<script setup lang="ts">
import ChartHeader from "@/components/common/ChartHeader.vue";
import SecondChild from "./second_child.vue";
</script>
<template>
  <div class="w-full h-full">
    <ChartHeader title="运行参数自主寻优" />
    <div class="frame-bg flex flex-col">
      <!-- HDI状态说明 -->
      <div class="flex justify-end items-center space-x-6 mr-[40px]">
        <div class="flex items-center space-x-1">
          <span class="text-[#9fe080]">●</span>
          <span class="text-white text-[14px]">标杆值</span>
        </div>
        <div class="flex items-center space-x-1">
          <span class="text-[#5470c6]">●</span>
          <span class="text-white text-[14px]">实际值</span>
        </div>
      </div>

      <div class="flex-1">
        <div class="w-full h-[50%] flex">
          <SecondChild label="主蒸汽温度" class="h-full w-full" />
          <SecondChild label="主蒸汽压力" class="h-full w-full" />
          <SecondChild label="低压加热器端差" class="h-full w-full" />
        </div>
        <div class="w-full h-[50%] flex">
          <SecondChild label="过冷度偏差" class="h-full w-full" />
          <SecondChild label="冷凝器端差" class="h-full w-full" />
          <SecondChild label="凝汽器真空" class="h-full w-full" />
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
