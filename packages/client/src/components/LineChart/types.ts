export interface LineDatum {
  date: Date
  income: number
  expense: number
  count: string
}

export enum Timespan {
  Monthly,
  Daily,
}
