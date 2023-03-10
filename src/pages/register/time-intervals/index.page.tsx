import { Container, Header } from '../styles'
import { Heading, MultiStep, Text } from '@ignite-ui/react'
import {
  IntervalBox,
  IntervalContainer,
  IntervalDay,
  IntervalInpus,
  IntervalItem,
} from './styles'

export default function TimeIntervals() {
  return (
    <Container>
      <Header>
        <Heading as="strong">Quase lá</Heading>
        <Text>
          Defina o intervalo de horários que você está disponível em cada dia da
          semana.
        </Text>

        <MultiStep size={4} currentStep={3} />
      </Header>

      <IntervalBox as="form">
        <IntervalContainer>
          <IntervalItem>
            <IntervalDay></IntervalDay>
            <IntervalInpus></IntervalInpus>
          </IntervalItem>
        </IntervalContainer>
      </IntervalBox>
    </Container>
  )
}
