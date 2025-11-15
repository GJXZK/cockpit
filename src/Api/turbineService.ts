import { get } from './request';

// 接口参数类型定义
interface TurbineParams {
  mid?: number | string; // 机器ID
}

// 响应数据类型定义
export interface TurbineOverviewData {
  inlet_steam_flow: number;
  inlet_steam_temperature: number;
  inlet_steam_pressure: number;
  generation_power: number;
  outlet_steam_flow: number;
  outlet_vacuum: number;
  outlet_casing_temperature: number;
  turbine_vibration: number;
  power_generation_efficiency_improvement: number;
}

export interface FlowAdviceData {
  target_power: number;
  target_flow: number;
  suggestion: string;
  total_flow_series:number[];
  total_steam_flow: number;
  unit1_flow_series: number[];
  unit2_flow_series: number[];
}

export interface SteamRateTrendData {
  steam_rates: number[];
}

export interface ThermalEfficiencyTrendData {
  thermal_efficiencies: number[];
}

export interface HeatRateTrendData {
  heat_rates: number[];
}

export interface ColdEndDiagnosisData {
  actual_values: number[];
  predicted_values: number[];
  ambient_temperature: number;
  air_pressure: number;
  humidity: number;
  wind_speed: number;
}

export interface UnitDiagnosisData {
  health_degradation_index: number[];
  warning_threshold: number;
}

export interface SystemAvailabilityData {
  status_detection: number;
  self_optimization: number;
  cold_end_optimization: number;
  optimization_control: number;
}

export interface AutoParameterOptimizationData {
  optimization_params: Array<[string, number, number]>;
}

/**
 * 汽轮机服务 API
 */
export const turbineService = {
  /**
   * 获取汽轮机概览数据
   */
  getOverview: (params?: TurbineParams): Promise<TurbineOverviewData> => {
    return get('/api/turbine/overview', params);
  },

  /**
   * 获取流量建议数据
   */
  getFlowAdvice: (params?: TurbineParams): Promise<FlowAdviceData> => {
    return get('/api/turbine/flow_advice', params);
  },

  /**
   * 获取蒸汽率趋势数据
   */
  getSteamRateTrend: (params?: TurbineParams): Promise<SteamRateTrendData> => {
    return get('/api/turbine/steam_rate_trend', params);
  },

  /**
   * 获取机组发电效率趋势数据
   */
  getThermalEfficiencyTrend: (params?: TurbineParams): Promise<ThermalEfficiencyTrendData> => {
    return get('/api/turbine/thermal_efficiency_trend', params);
  },

  /**
   * 获取热耗率趋势数据
   */
  getHeatRateTrend: (params?: TurbineParams): Promise<HeatRateTrendData> => {
    return get('/api/turbine/heat_rate_trend', params);
  },

  /**
   * 获取冷端诊断数据
   */
  getColdEndDiagnosis: (params?: TurbineParams): Promise<ColdEndDiagnosisData> => {
    return get('/api/turbine/cold_end_diagnosis', params);
  },

  /**
   * 获取单元诊断数据
   */
  getUnitDiagnosis: (params?: TurbineParams): Promise<UnitDiagnosisData> => {
    return get('/api/turbine/unit_diagnosis', params);
  },

  /**
   * 获取系统可用性状态
   */
  getSystemAvailability: (params?: TurbineParams): Promise<SystemAvailabilityData> => {
    return get('/api/turbine/system_availability', params);
  },

  /**
   * 获取自动参数优化数据
   */
  getAutoParameterOptimization: (params?: TurbineParams): Promise<AutoParameterOptimizationData> => {
    return get('/api/turbine/auto_parameter_optimization', params);
  },
};

// 默认导出
export default turbineService;