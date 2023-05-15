import dayjs from 'dayjs'
import { api } from '@/src/lib/axios'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './styles'
import { Calendar } from '@/src/components/Calendar'
import { useQuery } from '@tanstack/react-query'

interface Availability {
  possibleHours: number[]
  availableTimes: number[]
}

interface CalendarStepsProps {
  onSelectDateTime: (date: Date) => void
}

export function CalendarStep({ onSelectDateTime }: CalendarStepsProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const router = useRouter()

  const isDateSelected = !!selectedDate
  const username = router.query.username

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const weekDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null

  // React Query approach
  const { data: availability } = useQuery<Availability>(
    ['availability', selectedDateWithoutTime],
    async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: { date: selectedDateWithoutTime },
      })

      return response.data
    },
    {
      enabled: !!selectedDate, // only execute when selectedDate is not null
    },
  )

  function handleSelectTime(hour: number) {
    const dateWithTime = dayjs(selectedDate)
      .set('hour', hour)
      .startOf('hour')
      .toDate()

    onSelectDateTime(dateWithTime)
  }

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
                onClick={() => handleSelectTime(hour)}
                disabled={!availability.availableTimes.includes(hour)}
              >
                {String(hour).padStart(2, '0')}:00h
              </TimePickerItem>
            ))}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}
