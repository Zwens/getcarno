// src/engine/scoring.ts
import type { BaZi } from './bazi'
import { getXiYongShen, countWuXing } from './bazi'
import type { WuGeAnalysis } from './nameAnalysis'
import { calculateMingLi21, getMingLiNumber } from './mingLi21Calc'
import { DIGIT_WUXING, letterWuxing, getRelation } from '../data/wuxing'
import type { WuXing } from '../data/wuxing'

export interface PlateScore {
  plate: string
  totalScore: number
  wuxingScore: number
  mingLiScore: number
  harmonyScore: number
  shuLiScore: number
  reasons: string[]
}

function getPlateWuXingList(plate: string): WuXing[] {
  const body = plate.replace(/^粤/, '')
  const result: WuXing[] = []
  for (const ch of body) {
    if (/\d/.test(ch)) {
      result.push(DIGIT_WUXING[parseInt(ch)])
    } else if (/[A-Z]/i.test(ch)) {
      result.push(letterWuxing(ch))
    }
  }
  return result
}

function calcWuXingScore(plate: string, bazi: BaZi): { score: number; reason: string } {
  const { xi, yong } = getXiYongShen(bazi)
  const wuxingList = getPlateWuXingList(plate)

  let matchCount = 0
  const xiChars: string[] = []
  const yongChars: string[] = []
  const body = plate.replace(/^粤/, '')

  for (let i = 0; i < wuxingList.length; i++) {
    if (wuxingList[i] === xi) {
      matchCount += 2
      xiChars.push(body[i])
    } else if (wuxingList[i] === yong) {
      matchCount += 1.5
      yongChars.push(body[i])
    }
  }

  const maxScore = wuxingList.length * 2
  const score = Math.min(100, Math.round((matchCount / maxScore) * 100))

  const parts: string[] = []
  if (xiChars.length > 0) parts.push(`含喜神${xi}属性字符(${xiChars.join(',')})`)
  if (yongChars.length > 0) parts.push(`含用神${yong}属性字符(${yongChars.join(',')})`)
  const reason = parts.length > 0 ? parts.join('，') : '五行匹配度一般'

  return { score, reason }
}

function calcMingLiScore(plate: string): { score: number; reason: string } {
  const entry = calculateMingLi21(plate)
  const num = getMingLiNumber(plate)

  const scoreMap: Record<string, number> = {
    '大吉': 100, '吉': 80, '半吉': 60, '凶': 25, '大凶': 5,
  }

  const score = scoreMap[entry.level] ?? 50
  const reason = `命理数${num}「${entry.name}」${entry.level}，${entry.keyword}`

  return { score, reason }
}

function calcHarmonyScore(plate: string): { score: number; reason: string } {
  const wuxingList = getPlateWuXingList(plate)
  let shengCount = 0
  let keCount = 0
  let tongCount = 0

  for (let i = 0; i < wuxingList.length - 1; i++) {
    const rel = getRelation(wuxingList[i], wuxingList[i + 1])
    if (rel === '相生' || rel === '被生') shengCount++
    else if (rel === '相克' || rel === '被克') keCount++
    else tongCount++
  }

  const total = Math.max(1, shengCount + keCount + tongCount)
  const score = Math.round(((shengCount * 2 + tongCount * 1.5) / (total * 2)) * 100)

  const parts: string[] = []
  if (shengCount > 0) parts.push(`${shengCount}组相生`)
  if (tongCount > 0) parts.push(`${tongCount}组同类`)
  if (keCount > 0) parts.push(`${keCount}组相克`)
  const reason = `五行流通：${parts.join('、')}`

  return { score, reason }
}

function calcShuLiScore(plate: string, wugeAnalysis: WuGeAnalysis): { score: number; reason: string } {
  const renGeLevel = wugeAnalysis.renGeShuLi.level
  const levelScore: Record<string, number> = { '大吉': 100, '吉': 80, '半吉': 60, '凶': 30, '大凶': 10 }

  const score = Math.round((levelScore[renGeLevel] ?? 50) * 0.6 + (levelScore[wugeAnalysis.zongGeShuLi.level] ?? 50) * 0.4)
  const reason = `人格${wugeAnalysis.wuge.renGe}数「${wugeAnalysis.renGeShuLi.name}」${renGeLevel}`

  return { score, reason }
}

export function scorePlate(plate: string, bazi: BaZi, wugeAnalysis: WuGeAnalysis): PlateScore {
  const wx = calcWuXingScore(plate, bazi)
  const ml = calcMingLiScore(plate)
  const hm = calcHarmonyScore(plate)
  const sl = calcShuLiScore(plate, wugeAnalysis)

  const totalScore = Math.round(wx.score * 0.4 + ml.score * 0.3 + hm.score * 0.2 + sl.score * 0.1)

  return {
    plate,
    totalScore,
    wuxingScore: wx.score,
    mingLiScore: ml.score,
    harmonyScore: hm.score,
    shuLiScore: sl.score,
    reasons: [wx.reason, ml.reason, hm.reason, sl.reason],
  }
}

export function rankPlates(plates: string[], bazi: BaZi, wugeAnalysis: WuGeAnalysis, topN: number = 20): PlateScore[] {
  const scores = plates.map(p => scorePlate(p, bazi, wugeAnalysis))
  scores.sort((a, b) => b.totalScore - a.totalScore)
  return scores.slice(0, topN)
}
