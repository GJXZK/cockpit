<script setup lang="js">
import { useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue'
import First from '@/components/charts_left/first.vue'
import Second from '../components/charts_left/second.vue';
import mechineOne from '../components/charts_center/mechine_1.vue';
import mechineTwo from '../components/charts_center/mechine_2.vue';
import mechineThree from '../components/charts_center/mechine_3.vue';
import mechineFour from '../components/charts_center/mechine_4.vue';
import HotTrend from '../components/charts_left/HotTrend.vue';
import AirTrend from '../components/charts_center/AirTrend.vue';
import ELecTrend from '../components/charts_right/ElecTrend.vue';
import LiquidFill from '../components/common/LiquidFill.vue';
import SystemUseRate from '../components/charts_center/SystemUseRate.vue'
import UnitStatus from '../components/charts_right/UnitStatus.vue';
import ColdEndStatus from '../components/charts_right/ColdEndStatus.vue';
const currentTime = ref('')
let timer = null
const bgUrl = new URL('@/assets/picture/backgroundImg.png', import.meta.url).href
// 尺寸状态
const width = ref(window.innerWidth)
const height = ref(window.innerHeight)

const MAX_RATIO = 1920 / 1080

function resize() {
  const w = window.innerWidth
  const h = window.innerHeight
  const ratio = w / h

  // 限制最大比例不超过 16:9
  if (ratio > MAX_RATIO) {
    // 太宽 → 调整宽度
    height.value = h
    width.value = h * MAX_RATIO
  } else {
    // 太高 → 调整高度
    width.value = w
    height.value = w / MAX_RATIO
  }
}
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
const router = useRouter()
</script>
<template>
  <div
    class="w-screen h-screen flex flex-col"
    :style="{
      backgroundImage: `url(${bgUrl})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: '100% 100%',
    }"
  >
    <!-- header -->
    <div
      class="relative w-full overflow-hidden shrink-0 overflow: hidden;"
      style="aspect-ratio: 20 / 1"
    >
      <img
        class="absolute top-0 left-1/2 -translate-x-1/2 h-full w-auto min-w-[120%]"
        src="@/assets/picture/1678758747712-_gUPJr0X.png"
        alt="bg"
      />
      <h1
        class="header absolute inset-0 flex items-center justify-center text-white text-3vw font-bold -translate-y-4 margin: 0;"
      >
        垃圾焚烧汽轮机组智能监测与自主寻优系统
      </h1>
      <!-- 左上角机型 -->
      <div
        class="absolute top-3 left-4 text-white text-[18px] font-mono tracking-wider"
      >
        赣州 1#机
      </div>
      <!-- 右上角时间 -->
      <div
        class="absolute top-3 right-4 text-white text-[18px] font-mono tracking-wider"
      >
        {{ currentTime }}
      </div>
    </div>
    <!-- body -->
    <div class="flex-1 w-full h-full">
      <!-- 水平分为三个部分 -->
      <div class="flex h-full">
        <!-- left 25% -->
        <div class="w-[25%] h-full">
          <div class="w-full h-[66%] px-[10px]">
            <div class="w-full h-full rounded">
              <div class="h-[50%]">
                <first />
              </div>
              <div class="h-[50%]">
                <Second />
              </div>
            </div>
          </div>
          <div class="w-full h-[33%] px-[10px] pt-[10px] pb-[10px]">
            <div class="w-full h-full rounded">
              <HotTrend />
            </div>
          </div>
        </div>

        <!-- center 50% -->
        <div class="w-[50%] h-full">
          <div class="w-full h-[66%] px-[10px] pb-[10px]">
            <div class="w-full h-full rounded">
              <!-- 上半部分 轮机模型 -->
              <div class="w-full h-[60%]">
                <!-- 轮机模型 -->
                <div class="relative w-full h-full flex flex-col">
                  <!-- 轮机发电功率 -->
                  <div class="absolute w-full h-[40%] flex justify-between">
                    <!-- 发电功率 -->
                    <div
                      class="absolute inset-0 mx-auto w-max h-max flex flex-col items-center"
                    >
                      <img
                        src="@/assets/picture/ElecIcon.png"
                        alt=""
                        class="w-[60px]"
                      />
                      <div class="text-white text-[20px]">发电功率:</div>
                    </div>
                  </div>
                  <!-- 轮机 -->
                  <div class="w-[90%] mx-auto mt-auto mb-4 relative">
                    <img
                      src="@/assets/picture/SteamMechine.png"
                      class="w-full mx-auto mt-auto"
                    />
                    <!-- 蒸汽信息 -->
                    <div class="absolute top-[-14%] left-[5%]">
                      <div class="text-white text-[20px]">蒸汽流量:</div>
                      <div class="text-white text-[20px] mt-[30%]">
                        蒸汽温度:
                      </div>
                      <div class="text-white text-[20px] mt-[8%]">
                        蒸汽压力:
                      </div>
                    </div>

                    <div class="absolute top-[-14%] right-[12%]">
                      <!-- 蒸汽信息 -->
                      <div class="">
                        <div class="text-white text-[20px]">蒸汽流量:</div>
                        <div class="text-white text-[20px] mt-[30%]">真空:</div>
                        <div class="text-white text-[20px] mt-[8%]">
                          汽室温度:
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 下半部分 四个仪表盘 -->
              <div class="w-full h-[40%] flex">
                <mechineOne></mechineOne>
                <mechineTwo></mechineTwo>
                <mechineThree></mechineThree>
                <mechineFour></mechineFour>
              </div>
            </div>
          </div>
          <div class="w-full h-[33%] px-[10px] pt-[10px] pb-[10px]">
            <div class="w-full h-full rounded flex">
              <div class="w-[50%]">
                <ELecTrend />
              </div>
              <div class="w-[50%]">
                <SystemUseRate />
              </div>
            </div>
          </div>
        </div>

        <!-- right 25% -->
        <div class="w-[25%] h-full">
          <div class="w-full h-[66%] pb-[10px]">
            <div class="w-full h-full rounded">
              <div class="h-[50%]">
                <UnitStatus></UnitStatus>
              </div>
              <div class="h-[50%]">
                <ColdEndStatus />
              </div>
            </div>
          </div>
          <div class="w-full h-[33%] pt-[10px] pb-[10px]">
            <div class="w-full h-full rounded">
              <AirTrend />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.header {
  font-size: 1.6vw; /* 字体大小为视口宽度的2% */
}
img {
  display: block;
}
</style>
