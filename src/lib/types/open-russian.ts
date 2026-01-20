export interface OpenRussianResponse {
  result: Result
  error: any
}

export interface Result {
  term: string
  number: any
  words: Word[]
  sentences: Sentence[]
  singles: any[]
}

export interface Word {
  word: Word2
  forms: any[]
}

export interface Word2 {
  id: number
  ru: string
  type: string
  rank: number
  tls: string[][]
  tls2: Tls2[]
  verb?: Verb
  tags: string[]
}

export interface Tls2 {
  translation: string[]
  examples: Example[]
}

export interface Example {
  native: string
  translated: string
}

export interface Verb {
  aspect: string
  partners2: Partners2[]
}

export interface Partners2 {
  id: number
  accented: string
}

export interface Sentence {
  id: number
  ru: string
  links: Link[]
  tl: string
}

export interface Link {
  start: number
  length: number
  word: Word3
}

export interface Word3 {
  id: number
  word: string
}
