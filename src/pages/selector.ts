// src/pages/selector.ts
import { SHICHEN_OPTIONS } from '../data/tianganDizhi'
import { PLATE_SEGMENTS, enumeratePlates } from '../data/plateSegments'
import { calculateBazi, countWuXing, getDayMaster, getXiYongShen } from '../engine/bazi'
import type { BaZi } from '../engine/bazi'
import { analyzeWuGe } from '../engine/nameAnalysis'
import type { WuGeAnalysis } from '../engine/nameAnalysis'
import { rankPlates } from '../engine/scoring'
import { createPlateCard } from '../components/plateCard'
import { createRadarChart } from '../components/radarChart'
import { createResultCard } from '../components/resultCard'
import type { WuXing } from '../data/wuxing'

let currentStep = 1
let bazi: BaZi | null = null
let wugeAnalysis: WuGeAnalysis | null = null
let selectedSegments: Set<string> = new Set()

function wuxingClass(wx: WuXing): string {
  const map: Record<WuXing, string> = { '金': 'wuxing-jin', '木': 'wuxing-mu', '水': 'wuxing-shui', '火': 'wuxing-huo', '土': 'wuxing-tu' }
  return map[wx]
}

function levelTagHtml(level: string): string {
  const cls: Record<string, string> = { '大吉': 'level-daji', '吉': 'level-ji', '半吉': 'level-banji', '凶': 'level-xiong', '大凶': 'level-daxiong' }
  return `<span class="level-tag ${cls[level] || 'level-banji'}">${level}</span>`
}

function updateStepIndicator(page: HTMLElement) {
  page.querySelectorAll('.step-item').forEach((el, i) => {
    el.classList.remove('active', 'completed')
    if (i + 1 === currentStep) el.classList.add('active')
    else if (i + 1 < currentStep) el.classList.add('completed')
  })
}

function showStep(page: HTMLElement, step: number) {
  currentStep = step
  updateStepIndicator(page)
  page.querySelectorAll('.step-content').forEach(el => {
    (el as HTMLElement).style.display = 'none'
  })
  const target = page.querySelector(`#step-${step}`) as HTMLElement
  if (target) target.style.display = 'block'
}

function renderStep1(): string {
  const shichenOptions = SHICHEN_OPTIONS.map(s =>
    `<option value="${s.value}">${s.label}</option>`
  ).join('')

  return `
    <div class="step-content" id="step-1">
      <div class="form-card">
        <h3 style="margin-bottom:1.5rem;text-align:center;font-size:1.1rem;">输入个人信息</h3>
        <div class="form-group">
          <label class="form-label">姓名</label>
          <input type="text" class="form-input" id="input-name" placeholder="请输入您的姓名" />
        </div>
        <div class="form-group">
          <label class="form-label">性别</label>
          <div class="form-radio-group">
            <label class="form-radio"><input type="radio" name="gender" value="male" checked /> 男</label>
            <label class="form-radio"><input type="radio" name="gender" value="female" /> 女</label>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">出生日期</label>
          <input type="date" class="form-input" id="input-date" />
        </div>
        <div class="form-group">
          <label class="form-label">出生时辰</label>
          <select class="form-select" id="input-shichen">
            ${shichenOptions}
          </select>
        </div>
        <button class="btn-primary" id="btn-analyze">开始分析</button>
      </div>
    </div>
  `
}

function renderStep2(page: HTMLElement) {
  const container = page.querySelector('#step-2')!
  if (!bazi || !wugeAnalysis) return

  const count = countWuXing(bazi)
  const dayMaster = getDayMaster(bazi)
  const { xi, yong, riZhuStrength } = getXiYongShen(bazi)

  const pillars = [
    { label: '年柱', gan: bazi.year.gan, zhi: bazi.year.zhi },
    { label: '月柱', gan: bazi.month.gan, zhi: bazi.month.zhi },
    { label: '日柱', gan: bazi.day.gan, zhi: bazi.day.zhi },
    { label: '时柱', gan: bazi.hour.gan, zhi: bazi.hour.zhi },
  ]

  container.innerHTML = `
    <div class="report-section">
      <div class="report-title">八字排盘</div>
      <div class="bazi-grid">
        ${pillars.map(p => `
          <div class="bazi-pillar">
            <div class="bazi-pillar-label">${p.label}</div>
            <div class="bazi-pillar-gan">${p.gan}</div>
            <div class="bazi-pillar-zhi">${p.zhi}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="report-section">
      <div class="report-title">五行分析</div>
      <div class="radar-container" id="radar-mount"></div>
      <div style="text-align:center;margin-top:0.5rem;">
        <p>日主 <span class="${wuxingClass(dayMaster)}" style="font-weight:700;font-size:1.1rem;">${dayMaster}</span>
        ，日主${riZhuStrength}</p>
        <p style="margin-top:0.5rem;">
          喜神：<span class="${wuxingClass(xi)}" style="font-weight:700;">${xi}</span>
          &nbsp;&nbsp;
          用神：<span class="${wuxingClass(yong)}" style="font-weight:700;">${yong}</span>
        </p>
      </div>
    </div>

    <div class="report-section">
      <div class="report-title">姓名五格分析</div>
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:0.75rem;text-align:center;">
        ${[
          { name: '天格', val: wugeAnalysis.wuge.tianGe, sl: wugeAnalysis.tianGeShuLi },
          { name: '人格', val: wugeAnalysis.wuge.renGe, sl: wugeAnalysis.renGeShuLi },
          { name: '地格', val: wugeAnalysis.wuge.diGe, sl: wugeAnalysis.diGeShuLi },
          { name: '外格', val: wugeAnalysis.wuge.waiGe, sl: wugeAnalysis.waiGeShuLi },
          { name: '总格', val: wugeAnalysis.wuge.zongGe, sl: wugeAnalysis.zongGeShuLi },
        ].map(g => `
          <div style="background:var(--bg-primary);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:0.75rem;">
            <div style="font-size:0.8rem;color:var(--text-muted);">${g.name}</div>
            <div style="font-size:1.3rem;font-weight:700;margin:0.25rem 0;">${g.val}</div>
            <div style="font-size:0.75rem;">${g.sl.name}</div>
            ${levelTagHtml(g.sl.level)}
          </div>
        `).join('')}
      </div>
    </div>

    <button class="btn-primary" id="btn-to-step3" style="max-width:400px;margin:1.5rem auto 0;display:block;">
      下一步：选择号段
    </button>
  `

  const radarMount = container.querySelector('#radar-mount')!
  radarMount.appendChild(createRadarChart(count))
}

function renderStep3(page: HTMLElement) {
  const container = page.querySelector('#step-3')!
  selectedSegments.clear()

  container.innerHTML = `
    <div style="text-align:center;margin-bottom:1.5rem;">
      <p style="color:var(--text-secondary);">请选择您感兴趣的号段（可多选），系统将在所选号段中为您推荐最佳号码</p>
      <p style="color:var(--accent-cyan);margin-top:0.5rem;" id="selected-count">已选 0 个号段</p>
    </div>
    <div class="card-grid" id="step3-grid"></div>
    <button class="btn-primary" id="btn-to-step4" style="max-width:400px;margin:1.5rem auto 0;display:block;" disabled>
      生成推荐号码
    </button>
  `

  const grid = container.querySelector('#step3-grid')!
  const countEl = container.querySelector('#selected-count')!
  const btn = container.querySelector('#btn-to-step4') as HTMLButtonElement

  for (const seg of PLATE_SEGMENTS) {
    const key = seg.start
    const card = createPlateCard(seg, {
      selectable: true,
      selected: false,
      onToggle: () => {
        if (selectedSegments.has(key)) {
          selectedSegments.delete(key)
        } else {
          selectedSegments.add(key)
        }
        countEl.textContent = `已选 ${selectedSegments.size} 个号段`
        btn.disabled = selectedSegments.size === 0
      },
    })
    grid.appendChild(card)
  }
}

function renderStep4(page: HTMLElement) {
  const container = page.querySelector('#step-4')!
  if (!bazi || !wugeAnalysis) return

  container.innerHTML = `
    <div style="text-align:center;margin-bottom:1.5rem;">
      <div style="color:var(--text-secondary);">正在分析中...</div>
    </div>
  `

  const selectedSegs = PLATE_SEGMENTS.filter(s => selectedSegments.has(s.start))
  const allPlates: string[] = []
  for (const seg of selectedSegs) {
    allPlates.push(...enumeratePlates(seg))
  }

  const top20 = rankPlates(allPlates, bazi, wugeAnalysis, 20)

  container.innerHTML = `
    <div style="text-align:center;margin-bottom:1.5rem;">
      <h3 style="font-size:1.1rem;">命理推荐 Top 20</h3>
      <p style="color:var(--text-secondary);font-size:0.85rem;margin-top:0.5rem;">
        从 ${selectedSegs.length} 个号段共 ${allPlates.length} 个号码中精选
      </p>
    </div>
    <div class="result-list" id="result-list"></div>
    <button class="btn-primary" id="btn-restart" style="max-width:400px;margin:1.5rem auto 0;display:block;">
      重新选号
    </button>
  `

  const list = container.querySelector('#result-list')!
  top20.forEach((score, i) => {
    list.appendChild(createResultCard(score, i + 1))
  })
}

export function renderSelectorPage(): HTMLElement {
  const page = document.createElement('div')
  page.className = 'page'
  page.id = 'page-selector'

  page.innerHTML = `
    <div class="step-indicator">
      <div class="step-item active">
        <div class="step-num">1</div>
        <div>个人信息</div>
      </div>
      <div class="step-item">
        <div class="step-num">2</div>
        <div>命理分析</div>
      </div>
      <div class="step-item">
        <div class="step-num">3</div>
        <div>选择号段</div>
      </div>
      <div class="step-item">
        <div class="step-num">4</div>
        <div>推荐号码</div>
      </div>
    </div>

    ${renderStep1()}
    <div class="step-content" id="step-2" style="display:none;"></div>
    <div class="step-content" id="step-3" style="display:none;"></div>
    <div class="step-content" id="step-4" style="display:none;"></div>
  `

  setTimeout(() => {
    page.querySelector('#btn-analyze')!.addEventListener('click', () => {
      const name = (page.querySelector('#input-name') as HTMLInputElement).value.trim()
      const dateStr = (page.querySelector('#input-date') as HTMLInputElement).value
      const shichen = parseInt((page.querySelector('#input-shichen') as HTMLSelectElement).value)

      if (!name) { alert('请输入姓名'); return }
      if (!dateStr) { alert('请选择出生日期'); return }

      const [y, m, d] = dateStr.split('-').map(Number)
      bazi = calculateBazi(y, m, d, shichen)
      wugeAnalysis = analyzeWuGe(name)

      renderStep2(page)
      showStep(page, 2)
    })

    page.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      if (target.id === 'btn-to-step3') {
        renderStep3(page)
        showStep(page, 3)
      } else if (target.id === 'btn-to-step4') {
        renderStep4(page)
        showStep(page, 4)
      } else if (target.id === 'btn-restart') {
        currentStep = 1
        bazi = null
        wugeAnalysis = null
        selectedSegments.clear()
        showStep(page, 1)
      }
    })
  }, 0)

  return page
}
