import styled from '@emotion/styled'
import { Paper, Typography } from '@mui/material'
import { ReactNode } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'

import { useThemeStore } from '@/store/theme'

const Container = styled(Paper)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  width: 100%;
  border-radius: 10px;
`

export const DigitCard = ({
  title,
  text,
  icon,
}: {
  title: string
  text: string | number
  icon: ReactNode
}) => {
  const { theme } = useThemeStore()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

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
      <Typography variant={isMobile ? 'h5' : 'h4'}>{text}</Typography>
    </Container>
  )
}
