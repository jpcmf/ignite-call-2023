import { useState } from 'react'
import { ConfirmStep } from './ConfirmStep'
import { CalendarStep } from './CalendarStep'

export function ScheduleForm() {
  const [selectedDateTime, setSelectDateTime] = useState<Date | null>()

  if (selectedDateTime) {
    return <ConfirmStep />
  }

  return <CalendarStep onSelectDateTime={setSelectDateTime} />
}
