import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { describe, expect, it, vi } from 'vitest'
import { CreateAttendanceModal } from '../pages/Attendances/components/CreateAttendanceModal'

expect.extend(toHaveNoViolations)

describe('CreateAttendanceModal', () => {
  it('submits the backend payload shape', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(
      <CreateAttendanceModal
        isOpen
        isSubmitting={false}
        onClose={() => undefined}
        onSubmit={onSubmit}
      />,
    )

    await user.type(screen.getByLabelText('Cliente'), 'Bruno')
    await user.type(screen.getByLabelText('Assunto'), 'Problemas com cartao')
    await user.click(screen.getByRole('button', { name: 'Criar atendimento' }))

    expect(onSubmit).toHaveBeenCalledWith({
      customerName: 'Bruno',
      subject: 'Problemas com cartao',
    })
  })

  it('has no automated accessibility violations', async () => {
    const { container } = render(
      <CreateAttendanceModal
        isOpen
        isSubmitting={false}
        onClose={() => undefined}
        onSubmit={vi.fn()}
      />,
    )

    await expect(axe(container)).resolves.toHaveNoViolations()
  })
})
