import type { PlateScore } from '../engine/scoring'

function levelClass(score: number): string {
  if (score >= 85) return 'level-daji'
  if (score >= 70) return 'level-ji'
  if (score >= 55) return 'level-banji'
  return 'level-xiong'
}

function levelText(score: number): string {
  if (score >= 85) return '极佳'
  if (score >= 70) return '优良'
  if (score >= 55) return '尚可'
  return '一般'
}

export function createResultCard(score: PlateScore, rank: number): HTMLElement {
  const card = document.createElement('div')
  card.className = 'result-card'

  const reasonsHtml = score.reasons.map(r => `<li>${r}</li>`).join('')

  card.innerHTML = `
    <div class="result-rank">${rank}</div>
    <div class="result-body">
      <div class="result-plate">${score.plate}</div>
      <div class="result-score">
        综合得分 ${score.totalScore} 分
        <span class="level-tag ${levelClass(score.totalScore)}">${levelText(score.totalScore)}</span>
      </div>
      <div style="display:flex;gap:0.75rem;margin-top:0.4rem;font-size:0.75rem;color:var(--text-muted);">
        <span>五行${score.wuxingScore}</span>
        <span>命理${score.mingLiScore}</span>
        <span>和谐${score.harmonyScore}</span>
        <span>数理${score.shuLiScore}</span>
      </div>
      <ul class="result-reasons">${reasonsHtml}</ul>
    </div>
  `
  return card
}
