import { useState } from 'react'
import { ConfirmStep } from './ConfirmStep'
import { CalendarStep } from './CalendarStep'

export function ScheduleForm() {
  const [selectedDateTime, setSelectDateTime] = useState<Date | null>()

  function handleClearSelectedDateTime() {
    setSelectDateTime(null)
  }

  if (selectedDateTime) {
    return (
      <ConfirmStep
        schedulingDate={selectedDateTime}
        onCancelConfirmation={handleClearSelectedDateTime}
        onSaveConfirmation={handleClearSelectedDateTime}
      />
    )
  }

  return <CalendarStep onSelectDateTime={setSelectDateTime} />
}
