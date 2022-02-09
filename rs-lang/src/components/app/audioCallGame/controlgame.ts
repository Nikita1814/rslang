import AudioGame from "./audioGame";
import ApiService from "../api-service/api-service";
import './audioCall.css';


class ConrolGame {
  groupTrue: number;
  pageTrue: number;
  groupFirstPartFalse: number;
  pageFirstPartFalse: number;
  groupSecondPartFalse: number;
  pageSecondPartFalse: number;
  constructor(group: number, page = 0) {
    this.groupTrue = group;
    this.pageTrue = page;
    this.groupFirstPartFalse = this.getGroup(this.groupTrue);
    this.pageFirstPartFalse = this.getPage(this.groupTrue);
    this.groupSecondPartFalse = this.getGroup(this.groupFirstPartFalse);
    this.pageSecondPartFalse = this.getGroup(this.pageFirstPartFalse);
    this.getQuestions();
  }
  async getQuestions() {
    const trueWords = await new ApiService().getAudioWords(this.groupTrue, this.pageTrue);
    const falseFirstPartWords = await new ApiService().getAudioWords(this.groupFirstPartFalse, this.pageFirstPartFalse)
    const falseSecondPartWords = await new ApiService().getAudioWords(this.groupSecondPartFalse, this.pageSecondPartFalse);
    const arrayFalseWords = falseFirstPartWords.concat(falseSecondPartWords);
    const randomNumberForArrayTrueWords = this.randomInteger(0, 1);
    const arrayTrueWords = randomNumberForArrayTrueWords === 0 ? trueWords.slice(0, 10) : trueWords.slice(9, 19);
    const arrayQuestions = this.arraySplit(arrayFalseWords, 10).map((elem, i, arr) => {
      return { [`trueAnswer`]: arrayTrueWords[i], [`arrayFalseAnswers`]: arr[i] }
    })
    new AudioGame(arrayQuestions, arrayTrueWords, this.groupTrue, this.pageTrue);
  }
  getGroup(group: number) {
    if (group >= 0 && group !== 6) {
      group += 1;
    } else if (group === 6) {
      group -= 1;
    }
    return group;
  }
  getPage(page: number) {
    if (page >= 0 && page !== 29) {
      page += 1;
    } else if (page === 29) {
      page -= 1;
    }
    return page;
  }
  arraySplit(arr, c) {
    const result = new Array(c);
    for (let i = 0; i < c; ++i) {
      result[i] = [];
    }
    for (let i = 0; i < arr.length; ++i) {
      result[i % c].push(arr[i]);
    }
    return result;
  }
  randomInteger(min, max) {
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }
}
export default ConrolGame;