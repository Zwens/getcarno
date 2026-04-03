export type WuXing = '金' | '木' | '水' | '火' | '土'

export const DIGIT_WUXING: Record<number, WuXing> = {
  1: '水', 6: '水',
  2: '火', 7: '火',
  3: '木', 8: '木',
  4: '金', 9: '金',
  5: '土', 0: '土',
}

export function letterToNumber(ch: string): number {
  return (ch.toUpperCase().charCodeAt(0) - 64) % 10
}

export function letterWuxing(ch: string): WuXing {
  return DIGIT_WUXING[letterToNumber(ch)]
}

export const WUXING_SHENG: Record<WuXing, WuXing> = {
  '金': '水', '水': '木', '木': '火', '火': '土', '土': '金',
}

export const WUXING_KE: Record<WuXing, WuXing> = {
  '金': '木', '木': '土', '土': '水', '水': '火', '火': '金',
}

export type WuXingRelation = '相生' | '被生' | '相克' | '被克' | '同类'
export function getRelation(a: WuXing, b: WuXing): WuXingRelation {
  if (a === b) return '同类'
  if (WUXING_SHENG[a] === b) return '相生'
  if (WUXING_SHENG[b] === a) return '被生'
  if (WUXING_KE[a] === b) return '相克'
  return '被克'
}

export const WUXING_COLORS: Record<WuXing, string> = {
  '金': '#FFD700',
  '木': '#00E676',
  '水': '#2196F3',
  '火': '#FF5252',
  '土': '#FF9800',
}
