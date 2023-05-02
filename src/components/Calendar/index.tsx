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

interface CalendarDay {
  date: dayjs.Dayjs
  disabled: boolean
}
interface CalendarWeek {
  weekNumber: number
  days: CalendarDay[]
}

type CalendarWeeks = CalendarWeek[]

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1)
  })

  const shortWeekDays = getWeekDays({ short: true })

  function handlePreviousMonth() {
    setCurrentDate((state) => state.subtract(1, 'month'))
  }

  function handleNextMonth() {
    setCurrentDate((state) => state.add(1, 'month'))
  }

  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  const calendarWeeks = useMemo(() => {
    const daysInMonth = Array.from({ length: currentDate.daysInMonth() }).map(
      (_, index) => {
        return currentDate.set('date', index + 1)
        // .format('YYYY-MM-DD')
      },
    )

    const firstWeekDay = currentDate.day()
    // console.log(firstWeekDay)

    const previousMonthDays = Array.from({ length: firstWeekDay })
      .map((_, index) => {
        return currentDate.subtract(index + 1, 'day')
      })
      .reverse()
    // console.log(previousMonthDays)

    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    )

    const lastWeekDay = lastDayInCurrentMonth.get('day')
    // console.log(lastWeekDay)

    const nextMonthDays = Array.from({ length: 7 - (lastWeekDay + 1) }).map(
      (_, index) => {
        return lastDayInCurrentMonth.add(index + 1, 'day')
      },
    )
    // console.log(nextMonthDays)

    const calendarDays = [
      ...previousMonthDays.map((date) => {
        return { date, disabled: true }
      }),
      ...daysInMonth.map((date) => {
        return {
          date,
          disabled: false,
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
  }, [currentDate])

  console.log(calendarWeeks)

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
          <tr>
            <td>
              <CalendarButton disabled>1</CalendarButton>
            </td>
            <td>
              <CalendarButton>1</CalendarButton>
            </td>
            <td>
              <CalendarButton>1</CalendarButton>
            </td>
            <td>
              <CalendarButton>1</CalendarButton>
            </td>
            <td>
              <CalendarButton>1</CalendarButton>
            </td>
            <td>
              <CalendarButton>1</CalendarButton>
            </td>
            <td>
              <CalendarButton>1</CalendarButton>
            </td>
          </tr>
          <tr>
            <td>
              <CalendarButton>1</CalendarButton>
            </td>
            <td>
              <CalendarButton>1</CalendarButton>
            </td>
            <td>
              <CalendarButton>1</CalendarButton>
            </td>
            <td>
              <CalendarButton>1</CalendarButton>
            </td>
            <td>
              <CalendarButton disabled>1</CalendarButton>
            </td>
            <td>
              <CalendarButton>1</CalendarButton>
            </td>
            <td>
              <CalendarButton>1</CalendarButton>
            </td>
          </tr>
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  )
}
