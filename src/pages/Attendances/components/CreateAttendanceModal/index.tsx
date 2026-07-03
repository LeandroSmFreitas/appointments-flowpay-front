import { yupResolver } from '@hookform/resolvers/yup'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
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
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<CreateAttendancePayload>({
    defaultValues,
    resolver: yupResolver(schema),
  })

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
    <S.Backdrop>
      <S.Modal
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-attendance-title"
      >
        <S.ModalHeader>
          <div>
            <span>Novo atendimento</span>
            <h2 id="new-attendance-title">Criar atendimento</h2>
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
              {...register('customerName')}
            />
            {errors.customerName && <span>{errors.customerName.message}</span>}
          </S.Field>

          <S.Field>
            <label htmlFor="attendance-subject">Assunto</label>
            <textarea
              id="attendance-subject"
              rows={4}
              placeholder="Problemas com cartao"
              {...register('subject')}
            />
            {errors.subject && <span>{errors.subject.message}</span>}
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
