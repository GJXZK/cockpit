/**
 * 将数字转换为保留两位小数的格式
 * @param value 要处理的数值
 * @param defaultValue 当值为null/undefined时的默认值，默认为0
 * @returns 保留两位小数的数字
 */
export default function toFixedTwo(value: number | null | undefined, defaultValue: number = 0): number {
  if (value === null || value === undefined || isNaN(value)) {
    return toFixedTwo(defaultValue);
  }
  
  return Number(Number(value).toFixed(2));
}