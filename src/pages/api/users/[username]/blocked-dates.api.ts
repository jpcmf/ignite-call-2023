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
      user_id: user?.id,
    },
  })

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter((weekDay) => {
    return !availableWeekDays.some(
      (availableWeekDay) => availableWeekDay.week_day === weekDay,
    )
  })

  // SEG - [8,9,10] - [8,9] > true
  // TER - [8,9,10] - [8,9,10] > false

  const yearMonth = `${year}-${String(month).padStart(2, '0')}`

  // SQL Query
  const blockedDatesRaw: Array<{ date: number }> = await prisma.$queryRaw`
    SELECT 
      EXTRACT(DAY FROM S.date) AS date,
      COUNT(S.date) AS amount,
      ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60) AS size

    FROM schedulings S

    LEFT JOIN user_time_intervals UTI
      ON UTI.week_day = WEEKDAY(DATE_ADD(S.date, INTERVAL 1 DAY))

    WHERE S.user_id = ${user?.id} AND DATE_FORMAT(S.date, '%Y-%m') = ${yearMonth}

    GROUP BY EXTRACT(DAY FROM S.date),
      ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60)

    HAVING amount >= size
  `

  console.log(blockedDatesRaw)

  const blockedDates = blockedDatesRaw.map((blockedDate) => blockedDate.date)

  return res.json({ blockedWeekDays, blockedDates })
}
