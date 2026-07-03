import { yupResolver } from '@hookform/resolvers/yup'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
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
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<CreateAgentPayload>({
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
    await onSubmit(payload)
    reset(defaultValues)
    onClose()
  })

  return (
    <S.Backdrop>
      <S.Modal role="dialog" aria-modal="true" aria-labelledby="new-agent-title">
        <S.ModalHeader>
          <div>
            <span>Novo agente</span>
            <h2 id="new-agent-title">Criar agente</h2>
          </div>
          <S.IconButton type="button" onClick={onClose} aria-label="Fechar modal">
            <X size={18} />
          </S.IconButton>
        </S.ModalHeader>

        <S.Form onSubmit={(event) => void submitForm(event)}>
          <S.Field>
            <label htmlFor="agent-name">Nome</label>
            <input id="agent-name" type="text" {...register('name')} />
            {errors.name && <span>{errors.name.message}</span>}
          </S.Field>

          <S.Field>
            <label htmlFor="agent-email">E-mail</label>
            <input id="agent-email" type="email" {...register('email')} />
            {errors.email && <span>{errors.email.message}</span>}
          </S.Field>

          <S.Field>
            <label htmlFor="agent-team">Time</label>
            <select id="agent-team" {...register('team')}>
              {Object.values(TeamName).map((team) => (
                <option key={team} value={team}>
                  {teamLabels[team]}
                </option>
              ))}
            </select>
            {errors.team && <span>{errors.team.message}</span>}
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
