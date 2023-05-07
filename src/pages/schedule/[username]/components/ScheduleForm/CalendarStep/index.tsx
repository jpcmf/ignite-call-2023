import dayjs from 'dayjs'
import { api } from '@/src/lib/axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './styles'
import { Calendar } from '@/src/components/Calendar'

interface Availability {
  possibleHours: number[]
  availableTimes: number[]
}

export function CalendarStep() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [availability, setAvailability] = useState<Availability | null>(null)
  const router = useRouter()

  const isDateSelected = !!selectedDate
  const username = router.query.username

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const weekDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  useEffect(() => {
    if (!selectedDate) return

    api
      .get(`/users/${username}/availability`, {
        params: { date: dayjs(selectedDate).format('YYYY-MM-DD') },
      })
      .then((response) => {
        console.log(response.data)
        setAvailability(response.data)
      })
  }, [selectedDate, username])

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onSelectedDate={setSelectedDate} />

      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay}, <span>{weekDate}</span>
          </TimePickerHeader>
          <TimePickerList>
            {availability?.possibleHours.map((hour) => (
              <TimePickerItem
                key={hour}
                disabled={!availability.availableTimes.includes(hour)}
              >
                {String(hour).padStart(2, '0')}:00h
              </TimePickerItem>
            ))}

            {/* <TimePickerItem>09:00h</TimePickerItem> */}
            {/* <TimePickerItem>10:00h</TimePickerItem> */}
            {/* <TimePickerItem>11:00h</TimePickerItem> */}
            {/* <TimePickerItem>12:00h</TimePickerItem> */}
            {/* <TimePickerItem>13:00h</TimePickerItem> */}
            {/* <TimePickerItem>14:00h</TimePickerItem> */}
            {/* <TimePickerItem>15:00h</TimePickerItem> */}
            {/* <TimePickerItem>16:00h</TimePickerItem> */}
            {/* <TimePickerItem>17:00h</TimePickerItem> */}
            {/* <TimePickerItem>18:00h</TimePickerItem> */}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}
