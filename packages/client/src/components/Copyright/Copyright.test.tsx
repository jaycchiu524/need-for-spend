import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import Copyright from '@/components/Copyright'

describe('Copyright', () => {
  it('renders', () => {
    render(<Copyright />)
    expect(screen.getByText(/Copyright ©/)).toBeInTheDocument()
    expect(screen.getByText(/Jay Chiu Inc./)).toBeInTheDocument()

    // expect href to be https://kreatipedia.com/
    expect(screen.getByText(/Jay Chiu Inc./).closest('a')).toHaveAttribute(
      'href',
      'https://jaychiu.me/',
    )
  })
})
