import { useForm } from 'react-hook-form'
import { ArrowRight } from 'phosphor-react'
import { Container, Form, FormErrorContainer, Header } from './styles'
import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const handleWithRegisterFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Minímo de 3 caracteres' })
    .regex(/^([a-z\\\\-]+)$/i, { message: 'Letras e hífens são permetidos' }) // do not validate spaces, numbers, special chaaracter
    .transform((username) => username.toLowerCase()),
  name: z.string().min(3, { message: 'Minímo de 3 caracteres' }),
})

type RegisterFormData = z.infer<typeof handleWithRegisterFormSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(handleWithRegisterFormSchema),
  })

  async function handleRegister(data: RegisterFormData) {
    console.log(data)
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Bem-vindo ao Ignite Call.</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={1} />
      </Header>

      <Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size="sm">Nome de usuário</Text>
          <TextInput
            prefix="ignite.com/"
            placeholder="seu-usuario"
            {...register('username')}
          />
          {errors.username && (
            <FormErrorContainer size="sm">
              {errors.username.message}
            </FormErrorContainer>
          )}
        </label>
        <label>
          <Text size="sm">Nome completo</Text>
          <TextInput placeholder="Seu nome" {...register('name')} />
          {errors.name && (
            <FormErrorContainer size="sm">
              {errors.name.message}
            </FormErrorContainer>
          )}
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}
