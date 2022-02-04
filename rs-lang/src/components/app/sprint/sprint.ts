import './sprint.css'
import ApiService from '../api-service/api-service'
import { SprintRound } from './sprintRound'
import { SprintResult } from './sprintResult'
import { getRandomNumber } from './utils'
import { Word, SprintResultType, SprintSettings } from './types'

export class Sprint {
  round: SprintRound
  results: SprintResultType
  words: Word[]
  settings: SprintSettings
  pageNumber: number

  constructor(lvl: number, service: ApiService, pageNumber?: number) {
    this.settings = {
      service: service,
      lvl: lvl,
      timerValue: 20,
      pageNumber: pageNumber ?? getRandomNumber(29),
      freeGame: pageNumber ? false : true,
      pageStorage: [],
    }
    this.settings.pageStorage.push(this.settings.pageNumber)
    this.results = { answers: [[], []], points: 0, multiplier: 1, streak: 0 }
    this.initListener()
  }

  async updateSprint() {
    this.words = await this.settings.service.getWords(this.settings.lvl, this.settings.pageNumber)
    this.results = { answers: [[], []], points: 0, multiplier: 1, streak: 0 }
    this.round.updateRound(this.words, this.results)
    this.render()
  }

  addTimer() {
    let timerCurrentValue = this.settings.timerValue
    const timerId = setInterval(() => {
      if (document.querySelector('.sprint__timer')) {
        document.querySelector('.sprint__timer').innerHTML = String((timerCurrentValue -= 1))
      } else {
        clearInterval(timerId)
      }
    }, 1000)

    setTimeout(() => {
      clearInterval(timerId)

      new SprintResult(this.results).renderResult()
    }, this.settings.timerValue * 1000 + 1000)
  }

  async render() {
    this.words = this.words ?? (await this.settings.service.getWords(this.settings.lvl, this.settings.pageNumber))
    this.round = this.round ?? new SprintRound(this.results, this.words, this.settings)
    document.querySelector('.main').innerHTML = this.makeGame()
    this.addTimer()
  }

  makeGame() {
    return `<div class="sprint">
    <h2>Sprint</h2>
    <div class="sprint__timer">${this.settings.timerValue}</div>
    <button class="sprint__closer"><i class="far fa-times-circle"></i></button>
    <div class="sprint__container">
      <span class="sprint__counter">0</span>
      <ul class="sprint__counter-preview">
        <li><i class="far fa-circle"></i></li>
        <li><i class="far fa-circle"></i></li>
        <li><i class="far fa-circle"></i></li>
      </ul>

      <ul class="sprint__words">
       ${this.round.makeRound()}
      </ul>

      <ul class="sprint__verdict">
        <li class="sprint__verdict_wrong"> <button><i class="fas fa-times-circle"></i></button></li>
        <li class="sprint__verdict_true"><button><i class="fas fa-check-circle"></i></button></li>
      </ul>
      <ul class="sprint__pagination">
        <li class="sprint__pagination_previous"><button><i class="fas fa-arrow-circle-left"></i></button></li>
        <li class="sprint__pagination_next"><button><i class="fas fa-arrow-circle-right"></i> </button></li>
      </ul>
    </div>
  </div>`
  }

  initListener() {
    document.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement
      if (target.closest('.new-round')) {
        await this.updateSprint()
      }
    })
  }
}
