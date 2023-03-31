import { Avatar, Heading, Text } from '@ignite-ui/react'
import { Container, UserHeader } from './styles'

export default function Schedule() {
  return (
    <Container>
      <UserHeader>
        <Avatar src="https://github.com/jpcmf.png" />
        <Heading>João</Heading>
        <Text>SR Front-end Developer</Text>
      </UserHeader>
    </Container>
  )
}
