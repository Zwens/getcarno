import type { WuXing } from './wuxing'

export const TIAN_GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'] as const
export const DI_ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'] as const

export type TianGan = typeof TIAN_GAN[number]
export type DiZhi = typeof DI_ZHI[number]

export const TIANGAN_WUXING: Record<TianGan, WuXing> = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
}

export const DIZHI_WUXING: Record<DiZhi, WuXing> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水',
}

export const SHICHEN_OPTIONS = [
  { label: '子时 (23:00-01:00)', value: 0 },
  { label: '丑时 (01:00-03:00)', value: 1 },
  { label: '寅时 (03:00-05:00)', value: 2 },
  { label: '卯时 (05:00-07:00)', value: 3 },
  { label: '辰时 (07:00-09:00)', value: 4 },
  { label: '巳时 (09:00-11:00)', value: 5 },
  { label: '午时 (11:00-13:00)', value: 6 },
  { label: '未时 (13:00-15:00)', value: 7 },
  { label: '申时 (15:00-17:00)', value: 8 },
  { label: '酉时 (17:00-19:00)', value: 9 },
  { label: '戌时 (19:00-21:00)', value: 10 },
  { label: '亥时 (21:00-23:00)', value: 11 },
]

export function yearPillar(year: number): [TianGan, DiZhi] {
  const ganIdx = (year - 4) % 10
  const zhiIdx = (year - 4) % 12
  return [TIAN_GAN[ganIdx], DI_ZHI[zhiIdx]]
}

export function monthPillar(yearGan: TianGan, month: number): [TianGan, DiZhi] {
  const ganIdx = TIAN_GAN.indexOf(yearGan)
  const monthGanIdx = (ganIdx * 2 + month) % 10
  const monthZhiIdx = (month + 1) % 12
  return [TIAN_GAN[monthGanIdx], DI_ZHI[monthZhiIdx]]
}

export function dayPillar(year: number, month: number, day: number): [TianGan, DiZhi] {
  const base = new Date(1900, 0, 1)
  const target = new Date(year, month - 1, day)
  const diff = Math.floor((target.getTime() - base.getTime()) / 86400000)
  const ganIdx = ((diff % 10) + 10) % 10
  const zhiIdx = ((diff % 12) + 12) % 12
  return [TIAN_GAN[ganIdx], DI_ZHI[zhiIdx]]
}

export function hourPillar(dayGan: TianGan, hourIdx: number): [TianGan, DiZhi] {
  const ganIdx = TIAN_GAN.indexOf(dayGan)
  const hourGanIdx = (ganIdx * 2 + hourIdx) % 10
  return [TIAN_GAN[hourGanIdx], DI_ZHI[hourIdx]]
}
