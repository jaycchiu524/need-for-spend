import styled from '@emotion/styled'
import { Paper, Typography } from '@mui/material'
import { ReactNode } from 'react'

const Container = styled(Paper)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  width: 200px;
  border-radius: 10px;
`

export const DigitCard = ({
  title,
  text,
  icon,
}: {
  title: string
  text: string
  icon: ReactNode
}) => {
  return (
    <Container>
      {icon}
      <Typography
        variant="overline"
        display="block"
        gutterBottom
        align="center">
        {title}
      </Typography>
      <Typography variant={'h4'}>{text}</Typography>
    </Container>
  )
}
