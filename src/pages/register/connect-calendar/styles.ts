import { Box, styled } from '@ignite-ui/react'

export const ConnectBox = styled(Box, {
  display: 'flex',
  flexDirection: 'column',
  marginTop: '$6',
})

export const ConnectItem = styled('div', {
  alignItems: 'center',
  border: '1px solid $gray600',
  borderRadius: '$md',
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '$4',
  padding: '$4 $6',
})
