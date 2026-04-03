import { parseSegmentFormat } from '../data/plateSegments'
import type { PlateSegment } from '../data/plateSegments'

export interface PlateCardOptions {
  selectable?: boolean
  selected?: boolean
  onToggle?: (seg: PlateSegment) => void
}

export function createPlateCard(seg: PlateSegment, opts: PlateCardOptions = {}): HTMLElement {
  const fmt = parseSegmentFormat(seg)
  const card = document.createElement('div')
  card.className = `plate-card${opts.selectable ? ' selectable' : ''}${opts.selected ? ' selected' : ''}`

  const patternHtml = buildPatternHtml(fmt.pattern)

  const rulesHtml = fmt.positions.map((p, i) => {
    const posLabel = `第${i + 1}位`
    if (p.fixed) {
      const typeLabel = p.type === 'digit' ? '数字' : '字母'
      return `<li>${posLabel}：必须是${typeLabel} ${p.value}</li>`
    } else {
      return `<li>${posLabel}：必须是数字 ${p.value.replace('-', ' 到 ')} 之间的任意数字</li>`
    }
  }).join('')

  card.innerHTML = `
    ${opts.selectable ? '<div class="card-checkbox"></div>' : ''}
    <div class="plate-pattern">${patternHtml}</div>
    <div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:0.75rem;">
      这个号段涵盖了所有符合以下格式的号码：
    </div>
    <ul class="plate-rules">${rulesHtml}</ul>
    <div class="plate-meta">
      <span class="plate-count">共 ${fmt.totalCount} 个号码</span>
      <span>${seg.releaseTime}</span>
    </div>
  `

  if (opts.selectable && opts.onToggle) {
    card.addEventListener('click', () => {
      card.classList.toggle('selected')
      opts.onToggle!(seg)
    })
  }

  return card
}

function buildPatternHtml(pattern: string): string {
  let html = ''
  let i = 0
  while (i < pattern.length) {
    if (pattern[i] === '[') {
      const end = pattern.indexOf(']', i)
      html += `<span class="variable">[${pattern.slice(i + 1, end)}]</span>`
      i = end + 1
    } else {
      html += `<span class="fixed">${pattern[i]}</span>`
      i++
    }
  }
  return html
}
