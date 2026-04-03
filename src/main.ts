import './style.css'
import { renderOverviewPage } from './pages/overview'
import { renderSelectorPage } from './pages/selector'

function init() {
  const app = document.querySelector<HTMLDivElement>('#app')!

  app.innerHTML = `
    <nav class="navbar">
      <div class="navbar-title">车牌号码命理甄选系统</div>
      <div class="nav-tabs">
        <button class="nav-tab active" data-page="overview">号段总览</button>
        <button class="nav-tab" data-page="selector">命理选号</button>
      </div>
    </nav>
    <div class="main-content" id="main-content"></div>
  `

  const content = app.querySelector('#main-content')!
  const overviewPage = renderOverviewPage()
  const selectorPage = renderSelectorPage()

  content.appendChild(overviewPage)
  content.appendChild(selectorPage)

  overviewPage.classList.add('active')

  app.querySelector('.nav-tabs')!.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.nav-tab') as HTMLButtonElement | null
    if (!btn) return

    app.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'))
    btn.classList.add('active')

    const pageName = btn.dataset.page
    content.querySelectorAll('.page').forEach(p => p.classList.remove('active'))

    if (pageName === 'overview') {
      overviewPage.classList.add('active')
    } else {
      selectorPage.classList.add('active')
    }
  })
}

document.addEventListener('DOMContentLoaded', init)
