<script setup lang="ts">
import LiquidFill from '@/components/common/LiquidFill.vue';
import ChartHeader from "@/components/common/ChartHeader.vue";
</script>
<template>
  <div class="w-full h-full">
    <ChartHeader title="系统投用率" />
    <div class="frame-bg flex flex-wrap">
      <LiquidFill title="状态监测功能"></LiquidFill>
      <LiquidFill title="自主寻优功能"></LiquidFill>
      <LiquidFill title="冷端优化功能"></LiquidFill>
      <LiquidFill title="寻优控制功能"></LiquidFill>
    </div>
  </div>
</template>
<style scoped>
.chart-box {
  margin-top: 20px;
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
