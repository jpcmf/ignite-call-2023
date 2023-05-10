import { getWeekDays } from '@/src/utils/get-week-days'
import {
  CalendarBody,
  CalendarTitle,
  CalendarHeader,
  CalendarActions,
  CalendarContainer,
  CalendarButton,
} from './styles'
import { CaretLeft, CaretRight } from 'phosphor-react'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/src/lib/axios'
import { useRouter } from 'next/router'

interface CalendarDay {
  date: dayjs.Dayjs
  disabled: boolean | undefined
}
interface CalendarWeek {
  weekNumber: number
  days: CalendarDay[]
}

type CalendarWeeks = CalendarWeek[]

interface BlockedDates {
  blockedWeekDays: number[]
}

interface CalendarProps {
  selectedDate?: Date | null
  onSelectedDate: (date: Date) => void
}

export function Calendar({ selectedDate, onSelectedDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1)
  })

  const router = useRouter()

  function handlePreviousMonth() {
    setCurrentDate((state) => state.subtract(1, 'month'))
  }

  function handleNextMonth() {
    setCurrentDate((state) => state.add(1, 'month'))
  }

  const shortWeekDays = getWeekDays({ short: true })

  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  const username = String(router.query.username)

  // React Query approach
  const { data: blockedDates } = useQuery<BlockedDates>(
    ['blocked-dates', currentDate.get('year'), currentDate.get('month')],
    async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year: currentDate.get('year'),
          month: currentDate.get('month'),
        },
      })

      return response.data
    },
  )

  console.log(blockedDates)

  const calendarWeeks = useMemo(() => {
    const daysInMonth = Array.from({ length: currentDate.daysInMonth() }).map(
      (_, index) => {
        return currentDate.set('date', index + 1)
      },
    )

    const firstWeekDay = currentDate.get('day')

    const previousMonthDays = Array.from({ length: firstWeekDay })
      .map((_, index) => {
        return currentDate.subtract(index + 1, 'day')
      })
      .reverse()

    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    )

    const lastWeekDay = lastDayInCurrentMonth.get('day')

    const nextMonthDays = Array.from({ length: 7 - (lastWeekDay + 1) }).map(
      (_, index) => {
        return lastDayInCurrentMonth.add(index + 1, 'day')
      },
    )

    const calendarDays = [
      ...previousMonthDays.map((date) => {
        return { date, disabled: true }
      }),
      ...daysInMonth.map((date) => {
        return {
          date,
          disabled:
            date.endOf('day').isBefore(new Date()) ||
            blockedDates?.blockedWeekDays.includes(date.get('day')),
        }
      }),
      ...nextMonthDays.map((date) => {
        return { date, disabled: true }
      }),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, index, original) => {
        const isNewWeek = index % 7 === 0

        if (isNewWeek) {
          weeks.push({
            weekNumber: index / 7 + 1,
            days: original.slice(index, index + 7),
          })
        }

        return weeks
      },
      [],
    )

    return calendarWeeks
  }, [currentDate, blockedDates])

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>
        <CalendarActions>
          <button onClick={handlePreviousMonth} title="Mês anterior">
            <CaretLeft />
          </button>
          <button onClick={handleNextMonth} title="Próximo mês">
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>
      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((day) => (
              <th key={day}>{day}.</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map((week) => {
            return (
              <tr key={week.weekNumber}>
                {week.days.map((day) => {
                  return (
                    <td key={day.date.toString()}>
                      <CalendarButton
                        onClick={() => onSelectedDate(day.date.toDate())}
                        disabled={day.disabled}
                      >
                        {day.date.get('date')}
                      </CalendarButton>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
