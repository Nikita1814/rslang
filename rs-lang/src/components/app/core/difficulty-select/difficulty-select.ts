import ApiService from '../../api-service/api-service'

class DifficultySelect {
  gameName: string
  service: ApiService
  constructor(gameName: string, service: ApiService) {
    this.gameName = gameName
    this.service = service
  }
  render() {
    document.querySelector('.main').innerHTML = `
      <div class="diff-select">
      <h1 class="game-name">${this.gameName}</h1>
      <div class="level-select-btns">
          <div class="level-select" data-lvl="0">1</div>
          <div class="level-select" data-lvl="1">2</div>
          <div class="level-select" data-lvl="2">3</div>
          <div class="level-select" data-lvl="3">4</div>
          <div class="level-select" data-lvl="4">5</div>
          <div class="level-select" data-lvl="5">6</div>
      </div>
      </div>
      `
  }
  addListeners() {
    document.querySelectorAll('.level-select').forEach((el) => {
      el.addEventListener('click', (e) => {
        const lvl = Number((e.target as HTMLElement).dataset.lvl);
        let page: Object
        /*switch (this.gameName){                                            // Uncomment and change when you start working
                  case 'sprint ':
                  page = new Sprint(lvl, this.service );
                  page.render()
                  window.location.hash = 'sprint'
                  break;
                  case 'audio-challenge':
                  page = new AudioChallenge(lvl, this.service)
                  page.render() 
                  window.location.hash = 'audio-challenge'
              }*/
      })
    })
  }
}
export default DifficultySelect
