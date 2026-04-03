import { WUXING_COLORS } from '../data/wuxing'
import type { WuXing } from '../data/wuxing'

const LABELS: WuXing[] = ['金', '木', '水', '火', '土']

export function createRadarChart(data: Record<WuXing, number>, size: number = 280): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = size * 2
  canvas.height = size * 2
  canvas.style.width = size + 'px'
  canvas.style.height = size + 'px'

  const ctx = canvas.getContext('2d')!
  const cx = size
  const cy = size
  const radius = size * 0.7
  const angleStep = (Math.PI * 2) / 5

  ctx.strokeStyle = 'rgba(79, 109, 240, 0.15)'
  ctx.lineWidth = 1
  for (let level = 1; level <= 4; level++) {
    const r = (radius / 4) * level
    ctx.beginPath()
    for (let i = 0; i <= 5; i++) {
      const angle = angleStep * i - Math.PI / 2
      const x = cx + r * Math.cos(angle)
      const y = cy + r * Math.sin(angle)
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.stroke()
  }

  ctx.strokeStyle = 'rgba(79, 109, 240, 0.2)'
  for (let i = 0; i < 5; i++) {
    const angle = angleStep * i - Math.PI / 2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle))
    ctx.stroke()
  }

  const maxVal = Math.max(...Object.values(data), 1)
  ctx.beginPath()
  for (let i = 0; i <= 5; i++) {
    const idx = i % 5
    const val = data[LABELS[idx]] / maxVal
    const angle = angleStep * idx - Math.PI / 2
    const x = cx + radius * val * Math.cos(angle)
    const y = cy + radius * val * Math.sin(angle)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fillStyle = 'rgba(79, 109, 240, 0.25)'
  ctx.fill()
  ctx.strokeStyle = '#4f6df0'
  ctx.lineWidth = 2
  ctx.stroke()

  for (let i = 0; i < 5; i++) {
    const val = data[LABELS[i]] / maxVal
    const angle = angleStep * i - Math.PI / 2
    const x = cx + radius * val * Math.cos(angle)
    const y = cy + radius * val * Math.sin(angle)

    ctx.beginPath()
    ctx.arc(x, y, 6, 0, Math.PI * 2)
    ctx.fillStyle = WUXING_COLORS[LABELS[i]]
    ctx.fill()

    const lx = cx + (radius + 30) * Math.cos(angle)
    const ly = cy + (radius + 30) * Math.sin(angle)
    ctx.font = 'bold 24px sans-serif'
    ctx.fillStyle = WUXING_COLORS[LABELS[i]]
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${LABELS[i]} ${data[LABELS[i]]}`, lx, ly)
  }

  return canvas
}
