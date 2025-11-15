<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import First from "@/components/charts_left/first.vue";
import Second from "../components/charts_left/second.vue";
import mechineOne from "../components/charts_center/mechine_1.vue";
import mechineTwo from "../components/charts_center/mechine_2.vue";
import mechineThree from "../components/charts_center/mechine_3.vue";
import mechineFour from "../components/charts_center/mechine_4.vue";
import HotTrend from "../components/charts_left/HotTrend.vue";
import AirTrend from "../components/charts_right/AirTrend.vue";
import ELecTrend from "../components/charts_center/ElecTrend.vue";
import SystemUseRate from "../components/charts_center/SystemUseRate.vue";
import UnitStatus from "../components/charts_right/UnitStatus.vue";
import ColdEndStatus from "../components/charts_right/ColdEndStatus.vue";
import toFixedTwo from "@/util/utils.ts";
import turbineService, {
  type TurbineOverviewData,
} from "@/api/turbineService.ts";

const currentTime = ref("");
let timer: number | null = null;
const bgUrl = new URL("@/assets/picture/backgroundImg.png", import.meta.url)
  .href;

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};
const handleRefresh = (): void => {
  location.reload();
};

const toggleFullscreen = (): void => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.error(`全屏请求错误: ${err.message}`);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    handleRefresh();
  }
};

const handleClose = () => {};

const overviewData = ref<TurbineOverviewData | null>(null);

const getOverview = async () => {
  try {
    overviewData.value = await turbineService.getOverview();
  } catch (error) {
    console.error("获取概览数据失败:", error);
  }
};

onMounted(() => {
  getOverview();
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
// const router = useRouter()
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
        class="absolute top-3 right-4 text-white text-[18px] font-mono tracking-wider flex items-center gap-3"
      >
        {{ currentTime }}
        <div
          class="text-white hover:text-blue-200 transition-colors cursor-pointer"
          @click="handleRefresh"
          title="刷新"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M8 16H3v5" />
          </svg>
        </div>
        <!-- 全屏图标 -->
        <div
          class="text-white hover:text-blue-200 transition-colors cursor-pointer"
          @click="toggleFullscreen"
          title="全屏"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
            <path d="M3 16v3a2 2 0 0 0 2 2h3" />
            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
          </svg>
        </div>
        <div
          @click="handleClose()"
          class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-red-500/80 transition"
          title="关闭"
        >
          <svg
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
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
                      <div class="text-white text-[20px]">
                        发电功率:{{
                          toFixedTwo(overviewData?.generation_power)
                        }}
                      </div>
                    </div>
                  </div>
                  <!-- 轮机 -->
                  <div class="w-[90%] mx-auto mt-auto mb-4 relative">
                    <img
                      src="@/assets/picture/SteamMechine.png"
                      class="w-full mx-auto mt-auto"
                    />
                    <!-- 蒸汽信息 -->
                    <div class="absolute w-[50%] top-[-14%] left-[10%]">
                      <div class="text-white text-[18px]">
                        蒸汽流量:{{ overviewData?.inlet_steam_flow }}
                      </div>
                      <div class="text-white text-[18px] mt-[10%] ml-[35%]">
                        蒸汽温度:{{ overviewData?.inlet_steam_temperature }}
                      </div>
                      <div class="text-white text-[18px] mt-[2%] ml-[35%]">
                        蒸汽压力:{{ overviewData?.inlet_steam_pressure }}
                      </div>
                    </div>

                    <div class="absolute w-[50%] top-[-14%] right-0">
                      <!-- 蒸汽信息 -->
                      <div class="">
                        <div class="text-white text-[18px] ml-[45%]">
                          蒸汽流量:{{ overviewData?.outlet_steam_flow }}
                        </div>
                        <div class="text-white text-[18px] mt-[10%] ml-[5%]">
                          真空:{{ overviewData?.outlet_vacuum }}
                        </div>
                        <div class="text-white text-[18px] mt-[2%] ml-[5%]">
                          汽室温度:{{ overviewData?.outlet_casing_temperature }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 下半部分 四个仪表盘 -->
              <div class="w-full h-[40%] flex">
                <mechineOne
                  :value="
                    overviewData?.turbine_vibration
                      ? overviewData.turbine_vibration
                      : 0
                  "
                ></mechineOne>
                <mechineTwo
                  :value="
                    overviewData?.inlet_steam_flow
                      ? overviewData.inlet_steam_flow
                      : 0
                  "
                ></mechineTwo>
                <mechineThree
                  :value="
                    overviewData?.outlet_vacuum ? overviewData.outlet_vacuum : 0
                  "
                ></mechineThree>
                <mechineFour
                  :value="
                    overviewData?.power_generation_efficiency_improvement
                      ? overviewData.power_generation_efficiency_improvement
                      : 0
                  "
                ></mechineFour>
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
          <div class="w-full h-[66%]">
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
