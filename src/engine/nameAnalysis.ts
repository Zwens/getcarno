// src/engine/nameAnalysis.ts
import { getNameBihua } from '../data/kangxiBihua'
import { SHU_LI_81 } from '../data/shuLi81'
import type { ShuLi } from '../data/shuLi81'

export interface WuGe {
  tianGe: number
  renGe: number
  diGe: number
  waiGe: number
  zongGe: number
}

export interface WuGeAnalysis {
  wuge: WuGe
  tianGeShuLi: ShuLi
  renGeShuLi: ShuLi
  diGeShuLi: ShuLi
  waiGeShuLi: ShuLi
  zongGeShuLi: ShuLi
}

function toShuLi(n: number): ShuLi {
  const idx = n > 81 ? ((n - 1) % 80) + 1 : n
  return SHU_LI_81[idx - 1]
}

export function calculateWuGe(name: string): WuGe {
  const chars = Array.from(name)
  const bihua = getNameBihua(name)

  if (chars.length < 2) {
    return { tianGe: 2, renGe: bihua[0] + 1, diGe: 2, waiGe: 2, zongGe: bihua[0] + 1 }
  }

  const xingBihua = bihua[0]
  const mingBihua = bihua.slice(1)

  const tianGe = xingBihua + 1
  const renGe = xingBihua + mingBihua[0]
  const diGe = mingBihua.length === 1 ? mingBihua[0] + 1 : mingBihua.reduce((a, b) => a + b, 0)
  const zongGe = bihua.reduce((a, b) => a + b, 0)
  const waiGe = zongGe - renGe + 1

  return {
    tianGe: Math.max(1, tianGe),
    renGe: Math.max(1, renGe),
    diGe: Math.max(1, diGe),
    waiGe: Math.max(1, waiGe),
    zongGe: Math.max(1, zongGe),
  }
}

export function analyzeWuGe(name: string): WuGeAnalysis {
  const wuge = calculateWuGe(name)
  return {
    wuge,
    tianGeShuLi: toShuLi(wuge.tianGe),
    renGeShuLi: toShuLi(wuge.renGe),
    diGeShuLi: toShuLi(wuge.diGe),
    waiGeShuLi: toShuLi(wuge.waiGe),
    zongGeShuLi: toShuLi(wuge.zongGe),
  }
}
