export interface Word {
  _id?: string
  id: string
  group: number
  page: number
  word: string
  image: string
  audio: string
  userWord?: UserWordInfo
  audioMeaning: string
  audioExample: string
  textMeaning: string
  textExample: string
  transcription: string
  wordTranslate: string
  textMeaningTranslate: string
  textExampleTranslate: string
}

export interface FormInfo {
  email: string
  password: string
  name?: string
}
export interface UserTemplate {
  message: string
  token: string
  refreshToken: string
  userId: string
  name: string
}

export interface UserWordInfo {
  id?: string
  difficulty: string // either learned or normal or difficult
  optional: {
    timesGuessed: number // 3 times for a normal word to become learned, 5 times for a difficult one
    timesMax: number // 3 for normal ones 5 for difficult ones
  }
}