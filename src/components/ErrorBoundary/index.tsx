import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { createLogger } from '../../utils/logger'
import * as S from './styles'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

const logger = createLogger('error-boundary')

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('Unhandled UI error', {
      componentStack: errorInfo.componentStack,
      message: error.message,
      stack: error.stack,
    })
  }

  handleRetry = (): void => {
    this.setState({ hasError: false })
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <S.Wrapper role="alert">
        <S.Icon>
          <AlertTriangle size={22} />
        </S.Icon>
        <div>
          <h2>Algo saiu do esperado</h2>
          <p>
            A interface encontrou uma falha inesperada. Tente carregar a tela
            novamente.
          </p>
          <S.RetryButton type="button" onClick={this.handleRetry}>
            Tentar novamente
          </S.RetryButton>
        </div>
      </S.Wrapper>
    )
  }
}
