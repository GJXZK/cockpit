import { ref } from 'vue';

// 创建响应式数据作为全局状态
export const refreshSignal = ref(0);

// 触发刷新的函数
export const triggerRefresh = () => {
  refreshSignal.value += 1;
  console.log('触发全局数据刷新');
};

// 定时刷新控制
let refreshInterval: number | null = null;

// 启动定时刷新
export const startAutoRefresh = (interval: number = 5 * 60 * 1000) => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
  
  refreshInterval = setInterval(() => {
    triggerRefresh();
  }, interval);
  
  console.log(`启动自动刷新，间隔: ${interval / 1000}秒`);
};

// 停止定时刷新
export const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
    console.log('停止自动刷新');
  }
};

// 设置刷新间隔（分钟）
export const setRefreshInterval = (minutes: number) => {
  startAutoRefresh(minutes * 60 * 1000);
};