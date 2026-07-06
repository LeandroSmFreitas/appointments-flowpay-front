import 'styled-components'
import type { Theme } from './config/theme'

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {
    readonly __flowPayTheme?: never
  }
}
