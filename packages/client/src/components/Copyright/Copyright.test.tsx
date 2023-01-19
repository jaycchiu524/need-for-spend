import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import Copyright from '@/components/Copyright'

describe('Copyright', () => {
  it('renders', () => {
    render(<Copyright />)
    expect(screen.getByText(/Copyright ©/)).toBeInTheDocument()
    expect(screen.getByText(/Kreatipedia Inc./)).toBeInTheDocument()

    // expect href to be https://kreatipedia.com/
    expect(screen.getByText(/Kreatipedia Inc./).closest('a')).toHaveAttribute(
      'href',
      'https://kreatipedia.com/',
    )
  })
})
