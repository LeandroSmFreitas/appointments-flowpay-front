import * as S from './styles'

interface LoadingStateProps {
  label?: string
}

export function LoadingState({
  label = 'Carregando dados operacionais...',
}: LoadingStateProps) {
  return (
    <S.Wrapper role="status">
      <S.Spinner />
      <span>{label}</span>
    </S.Wrapper>
  )
}
