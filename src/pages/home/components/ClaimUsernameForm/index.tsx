import { Button, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from './styles'
import { zodResolver } from '@hookform/resolvers/zod'

const handleWithUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3)
    .regex(/^([a-z\\\\-]+)$/i), // do not validate spaces, numbers, special chaaracter
})

type ClaimUsernameFormData = z.infer<typeof handleWithUsernameFormSchema>

export function ClaimUsernameForm() {
  const { register, handleSubmit } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(handleWithUsernameFormSchema),
  })

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    console.log(data)
  }

  return (
    <div>
      <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
        <TextInput
          size="sm"
          prefix="ignite.com/"
          placeholder="seu-usuario"
          {...register('username')}
        />
        <Button size="sm" type="submit">
          Reservar
          <ArrowRight />
        </Button>
      </Form>
    </div>
  )
}
