import ApiService from '../api-service/api-service'
import DifficultySelect from '../core/difficulty-select/difficulty-select'
import MainPage from '../core/main-page/main-page'
import TextBookPage from '../core/text-book-page/text-book-page'
import Statistics from '../statistics/statistics'

class NavMenu {
  constructor(public service: ApiService, public mainPage: MainPage, public textBook: TextBookPage) {
    this.service = service
    this.mainPage = mainPage
    this.textBook = textBook
  }
  render(): void {
    document.querySelector('.navbar').innerHTML = `
      <nav class="page-navigation">
          <a href="#main" class="page-link active-link"><i class="fa-solid fa-house"></i></a>
          <a href="#text-book" class="page-link"><i class="fa-solid fa-book"></i></a>
          <a href="#sprint-choose" class="page-link "><i class="fa-solid fa-stopwatch"></i></a>
          <a href="#audio-challenge-choose" class="page-link"><i class="fa-solid fa-music"></i></a>
          <a href="#statistics" class="page-link"><i class="fa-solid fa-table"></i></a>
      </nav>
      `
    this.addListeners()
  }
  addListeners(): void {
    window.addEventListener('hashchange', (e) => {
      this.switchPage(e)
    })
  }
  switchPage(e: HashChangeEvent): void {
    document.querySelectorAll('.page-link')?.forEach((link) => {
      link.classList.remove('active-link')
    })
    document.querySelector(`[href='#${e.newURL.split('#')[1]}']`)?.classList.toggle('active-link')
    let page
    switch (e.newURL.split('#')[1]) {
      case 'main':
        page = this.mainPage
        page.render()
        break
      case 'text-book':
        page = this.textBook
        page.render()
        break
      case 'sprint-choose':
        page = new DifficultySelect('sprint', this.service)
        page.render()
        break
      case 'audio-challenge-choose':
        page = new DifficultySelect('audio-challenge', this.service)
        page.render()
        break
      case 'statistics':
        new Statistics()
        break
    }
  }
}
export default NavMenu
