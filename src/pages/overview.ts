// src/pages/overview.ts
import { PLATE_SEGMENTS } from '../data/plateSegments'
import type { PlateSegment } from '../data/plateSegments'
import { createPlateCard } from '../components/plateCard'

type FilterLetter = '全部' | 'G' | 'H' | 'K' | 'L'
type SortOrder = 'newest' | 'oldest'

let currentFilter: FilterLetter = '全部'
let currentSort: SortOrder = 'newest'

function getMiddleLetter(seg: PlateSegment): string {
  return seg.start[3]
}

function getFilteredSegments(): PlateSegment[] {
  let segs = [...PLATE_SEGMENTS]

  if (currentFilter !== '全部') {
    segs = segs.filter(s => getMiddleLetter(s) === currentFilter)
  }

  segs.sort((a, b) => {
    const ta = new Date(a.releaseTime).getTime()
    const tb = new Date(b.releaseTime).getTime()
    return currentSort === 'newest' ? tb - ta : ta - tb
  })

  return segs
}

function renderCards(container: HTMLElement) {
  const grid = container.querySelector('.card-grid')!
  grid.innerHTML = ''
  const segs = getFilteredSegments()
  for (const seg of segs) {
    grid.appendChild(createPlateCard(seg))
  }
}

export function renderOverviewPage(): HTMLElement {
  const page = document.createElement('div')
  page.className = 'page'
  page.id = 'page-overview'

  const letters = [...new Set(PLATE_SEGMENTS.map(getMiddleLetter))].sort()

  page.innerHTML = `
    <div class="filter-bar">
      <div class="filter-group" id="letter-filters">
        <button class="filter-btn active" data-filter="全部">全部</button>
        ${letters.map(l => `<button class="filter-btn" data-filter="${l}">${l}</button>`).join('')}
      </div>
      <div class="filter-group" id="sort-filters">
        <button class="filter-btn active" data-sort="newest">最新</button>
        <button class="filter-btn" data-sort="oldest">最早</button>
      </div>
      <span style="color:var(--text-muted);font-size:0.85rem;margin-left:auto;" id="segment-count"></span>
    </div>
    <div class="card-grid"></div>
  `

  page.querySelector('#letter-filters')!.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.filter-btn') as HTMLButtonElement | null
    if (!btn) return
    page.querySelectorAll('#letter-filters .filter-btn').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    currentFilter = btn.dataset.filter as FilterLetter
    renderCards(page)
    updateCount(page)
  })

  page.querySelector('#sort-filters')!.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.filter-btn') as HTMLButtonElement | null
    if (!btn) return
    page.querySelectorAll('#sort-filters .filter-btn').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')
    currentSort = btn.dataset.sort as SortOrder
    renderCards(page)
  })

  function updateCount(container: HTMLElement) {
    const count = getFilteredSegments().length
    container.querySelector('#segment-count')!.textContent = `共 ${count} 个号段`
  }

  setTimeout(() => {
    renderCards(page)
    updateCount(page)
  }, 0)

  return page
}
