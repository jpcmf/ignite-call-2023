/* eslint-disable camelcase */
import { prisma } from '@/src/lib/prisma'
import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const { username } = req.query
  const { date } = req.query

  // http://localhost:3333/api/users/username/availability?date=2021-03-01

  if (!date) {
    return res.status(400).json({ error: 'Missing date' })
  }

  const user = await prisma.user.findUnique({
    where: { username: String(username) },
  })

  if (!user) {
    return res.status(400).json({ error: 'User not found' })
  }

  const referenceDate = dayjs(date as string)
  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

  if (isPastDate) {
    // res.status(400).json({ error: 'Past dates are not allowed' })
    res.json({
      possibleHours: [],
      availableTimes: [],
    })
  }

  // Timeinterval vs Scheduling

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })

  if (!userAvailability) {
    return res.json({
      possibleHours: [],
      availableTimes: [],
    })
  }

  const { time_start_in_minutes, time_end_in_minutes } = userAvailability

  const startHour = time_start_in_minutes / 60 // 10
  const endHour = time_end_in_minutes / 60 // 18

  // [10,11,12,13,14,15,16,17]

  const possibleHours = Array.from({ length: endHour - startHour }).map(
    (_, index) => {
      return startHour + index
    },
  )

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true, // select just date in this query
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set('hour', startHour).toDate(),
        lte: referenceDate.set('hour', endHour).toDate(),
      },
    },
  })

  const availableTimes = possibleHours.filter((hour) => {
    const isTimeBlocked = blockedTimes.some(
      (blockedTime) => blockedTime.date.getHours() === hour,
    )

    const isTimeInPast = referenceDate.set('hour', hour).isBefore(new Date())

    return !isTimeBlocked && !isTimeInPast
  })

  return res.json({
    possibleHours,
    availableTimes,
  })
}
