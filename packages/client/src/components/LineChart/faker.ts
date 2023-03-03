import { faker } from '@faker-js/faker'

export const fakeData = () => [
  {
    date: new Date('2021-01-01'),
    value: faker.datatype.number({ max: 1000, min: 1 }),
  },
  {
    date: new Date('2021-01-02'),
    value: faker.datatype.number({ max: 1000, min: 1 }),
  },
  {
    date: new Date('2021-01-03'),
    value: faker.datatype.number({ max: 1000, min: 1 }),
  },
  {
    date: new Date('2021-01-04'),
    value: faker.datatype.number({ max: 1000, min: 1 }),
  },
  {
    date: new Date('2021-01-05'),
    value: faker.datatype.number({ max: 1000, min: 1 }),
  },
  {
    date: new Date('2021-01-06'),
    value: faker.datatype.number({ max: 1000, min: 1 }),
  },
  {
    date: new Date('2021-01-07'),
    value: faker.datatype.number({ max: 1000, min: 1 }),
  },
  {
    date: new Date('2021-01-08'),
    value: faker.datatype.number({ max: 1000, min: 1 }),
  },
  {
    date: new Date('2021-01-09'),
    value: faker.datatype.number({ max: 1000, min: 1 }),
  },
  {
    date: new Date('2021-01-10'),
    value: faker.datatype.number({ max: 1000, min: 1 }),
  },
  {
    date: new Date('2021-01-11'),
    value: faker.datatype.number({ max: 1000, min: 1 }),
  },
  {
    date: new Date('2021-01-12'),
    value: faker.datatype.number({ max: 1000, min: 1 }),
  },
  {
    date: new Date('2021-01-13'),
    value: faker.datatype.number({ max: 1000, min: 1 }),
  },
  {
    date: new Date('2021-01-14'),
    value: faker.datatype.number({ max: 1000, min: 1 }),
  },
  {
    date: new Date('2021-01-15'),
    value: faker.datatype.number({ max: 1000, min: 1 }),
  },
]

export const fakeGenerator = (
  quantity: number,
  startDate: Date,
  endDate: Date,
  type: 'day' | 'month' | 'year',
) => {
  const data = []

  if (type === 'month') {
    startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0)
  } else if (type === 'year') {
    startDate = new Date(startDate.getFullYear(), 0, 1)
    endDate = new Date(endDate.getFullYear(), 11, 31)
  } else {
    startDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
    )
    endDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
    )
  }

  const diff = endDate.getTime() - startDate.getTime()
  const step = diff / quantity

  for (let i = 0; i < quantity; i++) {
    data.push({
      date: new Date(startDate.getTime() + step * i),
      value: faker.datatype.number({ max: 1000, min: 1 }),
    })
  }

  return data
}
