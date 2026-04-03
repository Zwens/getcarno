// src/data/plateSegments.ts

export interface PlateSegment {
  start: string    // e.g. "B80G0E" (without "粤")
  end: string      // e.g. "B89G9E"
  releaseTime: string
  authority: string
  plateType: string
}

export interface SegmentFormat {
  pattern: string           // e.g. "粤B[8][0-9]G[0-9]E"
  positions: PositionDesc[]
  totalCount: number
}

export interface PositionDesc {
  index: number
  fixed: boolean
  value: string
  type: 'digit' | 'letter'
}

export function parseSegmentFormat(seg: PlateSegment): SegmentFormat {
  const s = seg.start
  const e = seg.end
  const body_s = s.slice(1) // skip "B"
  const body_e = e.slice(1)

  const positions: PositionDesc[] = []
  let totalCount = 1

  for (let i = 0; i < body_s.length; i++) {
    const cs = body_s[i]
    const ce = body_e[i]
    const isDigitChar = /\d/.test(cs)

    if (cs === ce) {
      positions.push({ index: i, fixed: true, value: cs, type: isDigitChar ? 'digit' : 'letter' })
    } else {
      totalCount *= (parseInt(ce) - parseInt(cs) + 1)
      positions.push({ index: i, fixed: false, value: `${cs}-${ce}`, type: 'digit' })
    }
  }

  let pattern = '粤B'
  for (const p of positions) {
    if (p.fixed) {
      pattern += p.value
    } else {
      pattern += `[${p.value}]`
    }
  }

  return { pattern, positions, totalCount }
}

export function enumeratePlates(seg: PlateSegment): string[] {
  const fmt = parseSegmentFormat(seg)
  const results: string[] = []

  function generate(idx: number, current: string) {
    if (idx === fmt.positions.length) {
      results.push('粤B' + current)
      return
    }
    const pos = fmt.positions[idx]
    if (pos.fixed) {
      generate(idx + 1, current + pos.value)
    } else {
      const [lo, hi] = pos.value.split('-').map(Number)
      for (let d = lo; d <= hi; d++) {
        generate(idx + 1, current + d.toString())
      }
    }
  }

  generate(0, '')
  return results
}

export const PLATE_SEGMENTS: PlateSegment[] = [
  { start: 'B80G0E', end: 'B89G9E', releaseTime: '2026-04-03 12:47', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B10H0D', end: 'B19H9D', releaseTime: '2026-04-03 12:30', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B80L0A', end: 'B89L9A', releaseTime: '2026-04-03 10:03', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B80G0H', end: 'B89G9H', releaseTime: '2026-03-30 15:01', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B70G0M', end: 'B79G9M', releaseTime: '2026-03-30 14:56', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B70G0K', end: 'B79G9K', releaseTime: '2026-03-27 20:02', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B70G0P', end: 'B79G9P', releaseTime: '2026-03-26 11:49', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B20G0F', end: 'B29G9F', releaseTime: '2026-03-24 17:05', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B70L0F', end: 'B79L9F', releaseTime: '2026-03-22 22:27', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B30G0A', end: 'B39G9A', releaseTime: '2026-03-18 12:33', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B20G0E', end: 'B29G9E', releaseTime: '2026-03-16 14:53', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B20G0Q', end: 'B29G9Q', releaseTime: '2026-03-13 14:52', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B20G0S', end: 'B29G9S', releaseTime: '2026-03-11 20:16', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B70K0D', end: 'B79K9D', releaseTime: '2026-03-10 16:01', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B80L0Q', end: 'B89L9Q', releaseTime: '2026-03-09 16:17', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B40K0E', end: 'B49K9E', releaseTime: '2026-03-07 21:34', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B40H0Q', end: 'B49H9Q', releaseTime: '2026-03-07 21:27', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B20G0N', end: 'B29G9N', releaseTime: '2026-03-07 21:06', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B30K0E', end: 'B39K9E', releaseTime: '2026-03-05 23:16', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B70L0C', end: 'B79L9C', releaseTime: '2026-03-05 22:54', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B90H0H', end: 'B99H9H', releaseTime: '2026-03-05 12:22', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B50H0Q', end: 'B59H9Q', releaseTime: '2026-03-05 12:15', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B30L0B', end: 'B39L9B', releaseTime: '2026-03-04 20:30', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B60H0D', end: 'B69H9D', releaseTime: '2026-03-04 20:22', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B20L0X', end: 'B29L9X', releaseTime: '2026-03-04 13:10', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B20G0V', end: 'B29G9V', releaseTime: '2026-03-04 12:57', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B30L0K', end: 'B39L9K', releaseTime: '2026-03-04 10:39', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B70H0H', end: 'B79H9H', releaseTime: '2026-03-04 10:14', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B70K0B', end: 'B79K9B', releaseTime: '2026-03-02 13:07', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B90H0R', end: 'B99H9R', releaseTime: '2026-02-28 10:31', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B30H0H', end: 'B39H9H', releaseTime: '2026-02-24 16:25', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B20K0E', end: 'B29K9E', releaseTime: '2026-02-24 15:58', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B70L0M', end: 'B79L9M', releaseTime: '2026-02-06 20:42', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B90L0K', end: 'B99L9K', releaseTime: '2026-02-06 20:32', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B10K0A', end: 'B19K9A', releaseTime: '2026-02-05 16:16', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B50L0K', end: 'B59L9K', releaseTime: '2026-02-04 21:25', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B30K0D', end: 'B39K9D', releaseTime: '2026-02-04 14:58', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B60K0D', end: 'B69K9D', releaseTime: '2026-02-04 11:43', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B60H0J', end: 'B69H9J', releaseTime: '2026-02-03 17:50', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B90H0J', end: 'B99H9J', releaseTime: '2026-02-03 17:22', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B20K0S', end: 'B29K9S', releaseTime: '2026-02-03 13:05', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B60L0Q', end: 'B69L9Q', releaseTime: '2026-02-03 13:01', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
  { start: 'B50L0A', end: 'B59L9A', releaseTime: '2026-02-03 11:53', authority: '深圳支队车辆管理所', plateType: '小型汽车' },
]
