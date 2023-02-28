export interface Datum {
  date: Date
  income: number
  expense: number
  count: string
}

export enum Timespan {
  Monthly,
  Daily,
}
