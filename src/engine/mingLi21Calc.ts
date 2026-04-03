// src/engine/mingLi21Calc.ts
import { MING_LI_21 } from '../data/mingLi21'
import type { MingLi21Entry } from '../data/mingLi21'

function charToNumber(ch: string): number {
  const upper = ch.toUpperCase()
  if (upper >= 'A' && upper <= 'Z') {
    return upper.charCodeAt(0) - 64
  }
  if (upper >= '0' && upper <= '9') {
    return parseInt(upper)
  }
  return 0
}

function reduceToMingLi(n: number): number {
  while (n > 21) {
    let sum = 0
    while (n > 0) {
      sum += n % 10
      n = Math.floor(n / 10)
    }
    n = sum
  }
  return n === 0 ? 21 : n
}

export function calculateMingLi21(plate: string): MingLi21Entry {
  const body = plate.replace(/^粤/, '')
  let total = 0

  for (const ch of body) {
    total += charToNumber(ch)
  }

  const mingLiNum = reduceToMingLi(total)
  return MING_LI_21[mingLiNum - 1]
}

export function getMingLiNumber(plate: string): number {
  const body = plate.replace(/^粤/, '')
  let total = 0
  for (const ch of body) {
    total += charToNumber(ch)
  }
  return reduceToMingLi(total)
}
