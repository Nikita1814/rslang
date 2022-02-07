import ApiService from '../../api-service/api-service'
import { Word } from '../../interfaces/interfaces'
import './text-book-page.css'

class TextBookPage {
  service: ApiService
  curPage: number
  curGrp: number
  constructor(service: ApiService) {
    this.service = service
    this.curPage = 0
    this.curGrp = 0
  }
  async render() {
    document.querySelector('.main').innerHTML = `<div class="textbook-container">
        <audio src='' class="tb-tts"></audio>
        <div class="tb-mini-game-select">
            <div class="tb-minigame"><i class="fas fa-running"></i> sprint</div>
            <div class="tb-minigame"><i class="fas fa-volume-up"></i> audio-challenge</div>
        </div>
        <div class="tb-pagination">
            <button data-direction="left" class="pagination-button"><i data-direction="left" class="fas fa-caret-left"></i></button>
            <div class="page-num">1</div>
            <button data-direction="right" class="pagination-button"><i data-direction="right" class="fas fa-caret-right"></i></button>
        </div>
        <div class="tb-group-select">
        <p>groups</p>
            <div class="group-select tb-group-selected" data-grp="0">1</div>
            <div class="group-select" data-grp="1">2</div>
            <div class="group-select" data-grp="2">3</div>
            <div class="group-select" data-grp="3">4</div>
            <div class="group-select" data-grp="4">5</div>
            <div class="group-select" data-grp="5">6</div>
            <div class="group-select difficult-select">D</div>
        </div>
        <div class="tb-words">
            
        </div>
    </div>`
    await this.getWords()
    this.addListeners()
    this.addControls()
  }
  async getWords() {
    try {
      document.querySelector(`.tb-words`).innerHTML = ``
      if (this.service.user !== null) {
        if (this.curGrp === 99) {
          const words: Word[] = await this.service.requestGetAggregatedFIlter(
            this.service.user.userId,
            `{"$and":[{"userWord.difficulty":"difficult"}]}`
          )
          console.log(words)
          words.forEach((word) => {
            this.drawWord(word)
          })
        } else {
          const words: Word[] = await this.service.requestGetUserAgregatedPageGrp(
            this.service.user.userId,
            String(this.curGrp),
            String(this.curPage),
            '20'
          )
          console.log(words)
          words.forEach((word) => {
            this.drawWord(word)
          })
        }
      } else {
        const words: Word[] = await this.service.requestWords(this.curGrp, this.curPage)
        words.forEach((word) => {
          this.drawWord(word)
        })
      }
    } catch (err) {
      let error = err as Error
      if (error.message.includes('401')) {
        await this.service.updateToken()
      } else {
        alert(err)
      }
    }
  }
  drawWord(word: Word) {
    try {
      const id = word.id ? word.id : word._id
      document.querySelector(`.tb-words`).innerHTML += `
    <div class="tb-word" data-tb-wrd-id=${id}>
    <img class="tb-img" src=${this.service.apiUrl}/${word.image}>
    <div data-tb-wrd-info=${id} class="tb-word-info">
    <div class="tb-word-title-translation-pronounciation">
        <h3 class="tb-word-title">${word.word} ${word.transcription}</h3>
        <h3 class="tb-word-translation">${word.wordTranslate}</h3>
        <button class="pronounce" data-tb-audio-btn-id=${id} data-audio-paths="${this.service.apiUrl}/${word.audio},${this.service.apiUrl}/${word.audioMeaning},${this.service.apiUrl}/${word.audioExample}"><i data-audio-paths="${this.service.apiUrl}/${word.audio},${this.service.apiUrl}/${word.audioMeaning},${this.service.apiUrl}/${word.audioExample}" data-tb-audio-btn-id=${id} class="fas fa-volume-up"></i></button>
    </div>
    <div class="tb-word-definition">
        <p class="tb-definition-english">${word.textMeaning}</p>
        <p class="tb-definition-translation">${word.textMeaningTranslate}</p>
    </div>
    <div class="tb-word-sentence">
        <p class="tb-sentence-english">${word.textExample}</p>
        <p class="tb-sentence-translation">${word.textExampleTranslate}</p>
    </div>
    </div>
<audio src=${this.service.apiUrl}/${word.audio} data-audio-paths="${this.service.apiUrl}/${word.audio},${this.service.apiUrl}/${word.audioMeaning},${this.service.apiUrl}/${word.audioExample}" data-tb-p-audio-id=${id} data-tb-audio-id=${id}></audio>
</div>
    `
      if (this.service.user !== null) {
        const progress = word.userWord ? `${word.userWord.optional.timesGuessed}` : '0'
        const max = word.userWord ? `${word.userWord.optional.timesMax}` : '3'
        const markStr = this.curGrp === 99 ? 'Mark as normal' : 'Mark as difficult'
        document.querySelector(`[data-tb-wrd-info="${id}"]`).innerHTML += `
      <div data-tb-useid="${id}" class="tb-user-functionality">
      <button data-tb-diffid="${id}" class="tb-add-difficult-btn">${markStr}</button>
       <div class="tb-learning-progress">${progress}/${max}</div>
      <button data-tb-learnid="${id}" class="tb-add-learned-btn">Mark as Learned</button>
  </div>
      `
        if (word.userWord) {
          if (word.userWord.difficulty === 'difficult') {
            document.querySelector(`[data-tb-wrd-id="${id}"]`).classList.add('tb-difficult-word')
          }
          if (word.userWord.difficulty === 'learned') {
            document.querySelector(`[data-tb-wrd-id="${id}"]`).classList.add('tb-learned-word')
          }
        }
      }
    } catch (err) {
      const error = err as Error
      if (error.message.includes('401')) {
        this.service.updateToken()
      } else {
        alert(err)
      }
    }
  }

  addListeners() {
    document.querySelectorAll('.pagination-button').forEach((elem) => {
      elem.addEventListener('click', (e) => {
        console.log('I got clicked')
        const target = e.target as HTMLButtonElement
        this.switchPage(target.dataset.direction)
      })
    })
    document.querySelectorAll('.group-select').forEach((div) => {
      div.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement
        document.querySelector('.tb-group-selected').classList.remove('tb-group-selected')
        target.classList.add('tb-group-selected')
        if (!target.classList.contains(`difficult-select`)) {
          document.querySelectorAll('.pagination-button').forEach((btn) => {
            const elem = btn as HTMLButtonElement
            elem.disabled = false
          })
          this.curGrp = Number(target.dataset.grp)
          await this.getWords()
          this.addControls()
        } else {
          this.curGrp = 99
          document.querySelectorAll('.pagination-button').forEach((btn) => {
            const elem = btn as HTMLButtonElement
            elem.disabled = true
          })
          await this.getWords()
          this.addControls()
        }
      })
    })
  }
  addControls() {
    document.querySelectorAll('.pronounce').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLElement
        this.playAudio(target.dataset.audioPaths)
      })
    })
    if (this.service.user !== null) {
      document.querySelectorAll('.tb-user-functionality').forEach((div) => {
        div.addEventListener('click', (e) => {
          const target = e.target as HTMLElement
          if (target.classList.contains('tb-add-difficult-btn')) {
            const id = target.dataset.tbDiffid
            const wordDiv = document.querySelector(`[data-tb-wrd-id="${id}"]`)
            if (wordDiv.classList.contains('tb-difficult-word') || wordDiv.classList.contains('tb-learned-word')) {
              try {
                this.service.requestUpdateUserWord(this.service.user.userId, target.dataset.tbDiffid, {
                  difficulty: 'difficult',
                  optional: { timesGuessed: 0, timesMax: 5 },
                })
              } catch (err) {
                const error = err as Error
                if (error.message.includes('401')) {
                  this.service.updateToken()
                } else {
                  alert(err)
                }
              }
            } else {
              try {
                this.service.requestAddUserWord(this.service.user.userId, id, {
                  difficulty: 'difficult',
                  optional: { timesGuessed: 0, timesMax: 5 },
                })
              } catch (err) {
                const error = err as Error
                if (error.message.includes('401')) {
                  this.service.updateToken()
                } else {
                  alert(err)
                }
              }
            }
            wordDiv.classList.remove('tb-learned-word')
            wordDiv.classList.add('tb-difficult-word')
            if (this.curGrp === 99) {
              try {
                this.service.requestUpdateUserWord(this.service.user.userId, id, {
                  difficulty: 'normal',
                  optional: { timesGuessed: 0, timesMax: 3 },
                })
                wordDiv.remove()
              } catch (err) {
                const error = err as Error
                if (error.message.includes('401')) {
                  this.service.updateToken()
                } else {
                  alert(err)
                }
              }
            }
          }
          if (target.classList.contains('tb-add-learned-btn')) {
            const id = target.dataset.tbLearnid
            const wordDiv = document.querySelector(`[data-tb-wrd-id="${id}"]`)
            if (wordDiv.classList.contains('tb-difficult-word') || wordDiv.classList.contains('tb-learned-word')) {
              try {
                this.service.requestUpdateUserWord(this.service.user.userId, id, {
                  difficulty: 'learned',
                  optional: { timesGuessed: 0, timesMax: 3 },
                })
              } catch (err) {
                const error = err as Error
                if (error.message.includes('401')) {
                  this.service.updateToken()
                } else {
                  alert(err)
                }
              }
            } else {
              try {
                this.service.requestAddUserWord(this.service.user.userId, id, {
                  difficulty: 'learned',
                  optional: { timesGuessed: 0, timesMax: 3 },
                })
              } catch (err) {
                const error = err as Error
                if (error.message.includes('401')) {
                  this.service.updateToken()
                } else {
                  alert(err)
                }
              }
            }
            wordDiv.classList.add('tb-learned-word')
            wordDiv.classList.remove('tb-difficult-word')
            if (this.curGrp === 99) {
              wordDiv.remove()
            }
          }
        })
      })
    }
  }
  async switchPage(direction: string) {
    console.log(direction)
    if (direction === 'right' && this.curPage < 29) {
      this.curPage++
      document.querySelector('.page-num').textContent = `${this.curPage + 1}`
    }

    if (direction === 'left' && this.curPage > 0) {
      this.curPage--
      document.querySelector('.page-num').textContent = `${this.curPage + 1}`
    }

    await this.getWords()
    this.addControls()
  }
  playAudio(paths: string) {
    const playlist = paths.split(',')
    const audio = document.querySelector('.tb-tts') as HTMLAudioElement
    audio.pause()
    audio.src = ``
    audio.src = playlist[0]
    let count = 0
    audio.addEventListener('ended', function playSound(e) {
      count += 1
      audio.src = playlist[count]
      audio.play()
      if (count === 2) {
        e.target.removeEventListener('ended', playSound)
      }
    })
    audio.play()
    console.log(playlist)
  }
}

export default TextBookPage