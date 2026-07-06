import { yupResolver } from '@hookform/resolvers/yup'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useDialogA11y } from '../../../../hooks/useDialogA11y'
import type { CreateAttendancePayload } from '../../../../models/interface/attendance'
import * as S from './styles'

interface CreateAttendanceModalProps {
  isOpen: boolean
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (payload: CreateAttendancePayload) => Promise<void>
}

const schema: yup.ObjectSchema<CreateAttendancePayload> = yup.object({
  customerName: yup.string().trim().required('Informe o nome do cliente.'),
  subject: yup.string().trim().required('Informe o assunto do atendimento.'),
})

const defaultValues: CreateAttendancePayload = {
  customerName: '',
  subject: '',
}

export function CreateAttendanceModal({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: CreateAttendanceModalProps) {
  const customerNameInputRef = useRef<HTMLInputElement | null>(null)
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<CreateAttendancePayload>({
    defaultValues,
    resolver: yupResolver(schema),
  })
  const { dialogRef, onDialogKeyDown } = useDialogA11y({
    initialFocusRef: customerNameInputRef,
    isOpen,
    onClose,
  })
  const customerNameRegistration = register('customerName')
  const subjectRegistration = register('subject')

  useEffect(() => {
    if (!isOpen) {
      reset(defaultValues)
    }
  }, [isOpen, reset])

  if (!isOpen) {
    return null
  }

  const submitForm = handleSubmit(async (payload) => {
    try {
      await onSubmit(payload)
      reset(defaultValues)
      onClose()
    } catch {
      // The hook keeps the modal open and exposes the API error in the page.
    }
  })

  return (
    <S.Backdrop onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <S.Modal
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-attendance-title"
        aria-describedby="new-attendance-description"
        onKeyDown={onDialogKeyDown}
      >
        <S.ModalHeader>
          <div>
            <span>Novo atendimento</span>
            <h2 id="new-attendance-title">Criar atendimento</h2>
            <p id="new-attendance-description">
              Registre a demanda inicial para entrada na fila operacional.
            </p>
          </div>
          <S.IconButton type="button" onClick={onClose} aria-label="Fechar modal">
            <X size={18} />
          </S.IconButton>
        </S.ModalHeader>

        <S.Form onSubmit={(event) => void submitForm(event)}>
          <S.Field>
            <label htmlFor="attendance-customer-name">Cliente</label>
            <input
              id="attendance-customer-name"
              type="text"
              placeholder="Bruno"
              aria-invalid={Boolean(errors.customerName)}
              aria-describedby={
                errors.customerName ? 'attendance-customer-name-error' : undefined
              }
              {...customerNameRegistration}
              ref={(element) => {
                customerNameRegistration.ref(element)
                customerNameInputRef.current = element
              }}
            />
            {errors.customerName && (
              <span id="attendance-customer-name-error" role="alert">
                {errors.customerName.message}
              </span>
            )}
          </S.Field>

          <S.Field>
            <label htmlFor="attendance-subject">Assunto</label>
            <textarea
              id="attendance-subject"
              rows={4}
              placeholder="Problemas com cartão"
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={
                errors.subject ? 'attendance-subject-error' : undefined
              }
              {...subjectRegistration}
            />
            {errors.subject && (
              <span id="attendance-subject-error" role="alert">
                {errors.subject.message}
              </span>
            )}
          </S.Field>

          <S.Footer>
            <S.SecondaryButton type="button" onClick={onClose}>
              Cancelar
            </S.SecondaryButton>
            <S.PrimaryButton type="submit" disabled={isSubmitting}>
              Criar atendimento
            </S.PrimaryButton>
          </S.Footer>
        </S.Form>
      </S.Modal>
    </S.Backdrop>
  )
}
