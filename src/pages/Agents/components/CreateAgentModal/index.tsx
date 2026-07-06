import { yupResolver } from '@hookform/resolvers/yup'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useDialogA11y } from '../../../../hooks/useDialogA11y'
import { TeamName } from '../../../../models/enum/teamName'
import type { CreateAgentPayload } from '../../../../models/interface/agent'
import { teamLabels } from '../../../../utils/statusUtils'
import * as S from './styles'

interface CreateAgentModalProps {
  isOpen: boolean
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (payload: CreateAgentPayload) => Promise<void>
}

const schema: yup.ObjectSchema<CreateAgentPayload> = yup.object({
  name: yup.string().trim().required('Informe o nome do agente.'),
  email: yup
    .string()
    .trim()
    .email('Informe um e-mail válido.')
    .required('Informe o e-mail do agente.'),
  team: yup
    .mixed<TeamName>()
    .oneOf(Object.values(TeamName))
    .required('Selecione o time.'),
})

const defaultValues: CreateAgentPayload = {
  name: '',
  email: '',
  team: TeamName.CARTOES,
}

export function CreateAgentModal({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: CreateAgentModalProps) {
  const nameInputRef = useRef<HTMLInputElement | null>(null)
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<CreateAgentPayload>({
    defaultValues,
    resolver: yupResolver(schema),
  })
  const { dialogRef, onDialogKeyDown } = useDialogA11y({
    initialFocusRef: nameInputRef,
    isOpen,
    onClose,
  })
  const nameRegistration = register('name')
  const emailRegistration = register('email')

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
        aria-labelledby="new-agent-title"
        aria-describedby="new-agent-description"
        onKeyDown={onDialogKeyDown}
      >
        <S.ModalHeader>
          <div>
            <span>Novo agente</span>
            <h2 id="new-agent-title">Criar agente</h2>
            <p id="new-agent-description">
              Cadastre um colaborador para distribuição de atendimentos.
            </p>
          </div>
          <S.IconButton type="button" onClick={onClose} aria-label="Fechar modal">
            <X size={18} />
          </S.IconButton>
        </S.ModalHeader>

        <S.Form onSubmit={(event) => void submitForm(event)}>
          <S.Field>
            <label htmlFor="agent-name">Nome</label>
            <input
              id="agent-name"
              type="text"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'agent-name-error' : undefined}
              {...nameRegistration}
              ref={(element) => {
                nameRegistration.ref(element)
                nameInputRef.current = element
              }}
            />
            {errors.name && (
              <span id="agent-name-error" role="alert">
                {errors.name.message}
              </span>
            )}
          </S.Field>

          <S.Field>
            <label htmlFor="agent-email">E-mail</label>
            <input
              id="agent-email"
              type="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'agent-email-error' : undefined}
              {...emailRegistration}
            />
            {errors.email && (
              <span id="agent-email-error" role="alert">
                {errors.email.message}
              </span>
            )}
          </S.Field>

          <S.Field>
            <label htmlFor="agent-team">Time</label>
            <select
              id="agent-team"
              aria-invalid={Boolean(errors.team)}
              aria-describedby={errors.team ? 'agent-team-error' : undefined}
              {...register('team')}
            >
              {Object.values(TeamName).map((team) => (
                <option key={team} value={team}>
                  {teamLabels[team]}
                </option>
              ))}
            </select>
            {errors.team && (
              <span id="agent-team-error" role="alert">
                {errors.team.message}
              </span>
            )}
          </S.Field>

          <S.Footer>
            <S.SecondaryButton type="button" onClick={onClose}>
              Cancelar
            </S.SecondaryButton>
            <S.PrimaryButton type="submit" disabled={isSubmitting}>
              Criar agente
            </S.PrimaryButton>
          </S.Footer>
        </S.Form>
      </S.Modal>
    </S.Backdrop>
  )
}
