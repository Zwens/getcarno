// src/engine/bazi.ts
import { yearPillar, monthPillar, dayPillar, hourPillar, TIANGAN_WUXING, DIZHI_WUXING } from '../data/tianganDizhi'
import type { TianGan, DiZhi } from '../data/tianganDizhi'
import type { WuXing } from '../data/wuxing'

export interface Pillar {
  gan: TianGan
  zhi: DiZhi
}

export interface BaZi {
  year: Pillar
  month: Pillar
  day: Pillar
  hour: Pillar
}

export interface WuXingCount {
  '金': number
  '木': number
  '水': number
  '火': number
  '土': number
}

export function calculateBazi(
  year: number,
  month: number,
  day: number,
  hourIndex: number
): BaZi {
  const [yGan, yZhi] = yearPillar(year)
  const [mGan, mZhi] = monthPillar(yGan, month)
  const [dGan, dZhi] = dayPillar(year, month, day)
  const [hGan, hZhi] = hourPillar(dGan, hourIndex)

  return {
    year: { gan: yGan, zhi: yZhi },
    month: { gan: mGan, zhi: mZhi },
    day: { gan: dGan, zhi: dZhi },
    hour: { gan: hGan, zhi: hZhi },
  }
}

export function countWuXing(bazi: BaZi): WuXingCount {
  const count: WuXingCount = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 }
  const pillars = [bazi.year, bazi.month, bazi.day, bazi.hour]

  for (const p of pillars) {
    count[TIANGAN_WUXING[p.gan]]++
    count[DIZHI_WUXING[p.zhi]]++
  }

  return count
}

export function getDayMaster(bazi: BaZi): WuXing {
  return TIANGAN_WUXING[bazi.day.gan]
}

export function getXiYongShen(bazi: BaZi): { xi: WuXing; yong: WuXing; riZhuStrength: '偏强' | '偏弱' | '中和' } {
  const count = countWuXing(bazi)
  const dayMaster = getDayMaster(bazi)

  const shengMap: Record<WuXing, WuXing> = { '金': '水', '水': '木', '木': '火', '火': '土', '土': '金' }
  const beiShengMap: Record<WuXing, WuXing> = { '水': '金', '木': '水', '火': '木', '土': '火', '金': '土' }
  const keMap: Record<WuXing, WuXing> = { '金': '木', '木': '土', '土': '水', '水': '火', '火': '金' }
  const beiKeMap: Record<WuXing, WuXing> = { '木': '金', '土': '木', '水': '土', '火': '水', '金': '火' }

  const support = count[dayMaster] + count[beiShengMap[dayMaster]]
  const drain = count[beiKeMap[dayMaster]] + count[shengMap[dayMaster]] + count[keMap[dayMaster]]

  let riZhuStrength: '偏强' | '偏弱' | '中和'
  let xi: WuXing
  let yong: WuXing

  if (support > drain + 1) {
    riZhuStrength = '偏强'
    xi = keMap[dayMaster]
    yong = beiKeMap[dayMaster]
  } else if (drain > support + 1) {
    riZhuStrength = '偏弱'
    xi = beiShengMap[dayMaster]
    yong = dayMaster
  } else {
    riZhuStrength = '中和'
    xi = dayMaster
    yong = beiShengMap[dayMaster]
  }

  return { xi, yong, riZhuStrength }
}
