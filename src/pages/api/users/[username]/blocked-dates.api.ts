/* eslint-disable camelcase */
import { prisma } from '@/src/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.status(405).end()
  }

  const { username } = req.query
  const { year, month } = req.query

  // http://localhost:3333/api/users/username/blocked-dates?year=2023&month=5

  if (!year || !month) {
    res.status(400).json({ error: 'Missing year or month' })
  }

  const user = await prisma.user.findUnique({
    where: { username: String(username) },
  })

  if (!user) {
    res.status(400).json({ error: 'User not found' })
  }

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: {
      week_day: true,
    },
    where: {
      user_id: user.id,
    },
  })

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter((weekDay) => {
    return !availableWeekDays.some(
      (availableWeekDay) => availableWeekDay.week_day === weekDay,
    )
  })

  // SEG - [8,9,10] - [8,9] > true
  // TER - [8,9,10] - [8,9,10] > false

  const blockedDatesRaw = await prisma.$queryRaw`
    SELECT * FROM schedulings S

    WHERE S.user_id = ${
      user?.id
    } AND DATE_FORMAT(S.date, '%Y-%m') = ${`${year}-${month}`}
  `

  return res.json({ blockedWeekDays, blockedDatesRaw })
}
