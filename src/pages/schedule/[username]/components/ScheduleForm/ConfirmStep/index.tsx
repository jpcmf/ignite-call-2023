import { Text, TextArea, TextInput, Button } from '@ignite-ui/react'
import { ConfirmForm, FormActions, FormHeader } from './styles'
import { CalendarBlank, Clock } from 'phosphor-react'

export function ConfirmStep() {
  function handleConfirmSchedule() {}

  return (
    <ConfirmForm as="form" onSubmit={handleConfirmSchedule}>
      <FormHeader>
        <Text>
          <CalendarBlank />
          27 de abril de 2023
        </Text>
        <Text>
          <Clock />
          10:00h
        </Text>
      </FormHeader>

      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput placeholder="Seu nome" />
      </label>

      <label>
        <Text size="sm">Endereço de email</Text>
        <TextInput type="email" placeholder="jonhdoe@example.com" />
      </label>

      <label>
        <Text size="sm">Observações</Text>
        <TextArea />
      </label>

      <FormActions>
        <Button type="button" variant="tertiary">
          Cancelar
        </Button>
        <Button type="submit">Confirmar</Button>
      </FormActions>
    </ConfirmForm>
  )
}
