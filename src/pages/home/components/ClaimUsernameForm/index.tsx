import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { ArrowRight } from 'phosphor-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Text, TextInput } from '@ignite-ui/react'
import { Form, FormErrorContainer } from './styles'

const handleWithUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Minímo de 3 caracteres' })
    .regex(/^([a-z\\\\-]+)$/i, { message: 'Letras e hífens são permetidos' }) // do not validate spaces, numbers, special chaaracter
    .transform((username) => username.toLowerCase()),
})

type ClaimUsernameFormData = z.infer<typeof handleWithUsernameFormSchema>

export function ClaimUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimUsernameFormData>({
    resolver: zodResolver(handleWithUsernameFormSchema),
  })

  async function handleClaimUsername(data: ClaimUsernameFormData) {
    console.log(data)
  }

  return (
    <>
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

      <FormErrorContainer>
        <Text size="sm">
          {errors.username ? errors.username?.message : null}
          {/* {errors.username ? errors.username?.message : 'Digite o nome do usuário'} */}
        </Text>
      </FormErrorContainer>
    </>
  )
}
