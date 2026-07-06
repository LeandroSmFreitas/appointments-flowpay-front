import {
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent,
  type RefObject,
} from 'react'

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

const getFocusableElements = (container: HTMLElement): HTMLElement[] =>
  Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) =>
      !element.hasAttribute('disabled') &&
      element.getAttribute('aria-hidden') !== 'true',
  )

interface UseDialogA11yParams<TInitialFocusElement extends HTMLElement> {
  initialFocusRef?: RefObject<TInitialFocusElement | null>
  isOpen: boolean
  onClose: () => void
}

interface UseDialogA11yResult {
  dialogRef: RefObject<HTMLDivElement | null>
  onDialogKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void
}

export function useDialogA11y<TInitialFocusElement extends HTMLElement>({
  initialFocusRef,
  isOpen,
  onClose,
}: UseDialogA11yParams<TInitialFocusElement>): UseDialogA11yResult {
  const dialogRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const previousActiveElement = document.activeElement

    window.requestAnimationFrame(() => {
      const targetElement =
        initialFocusRef?.current ??
        dialogRef.current?.querySelector<HTMLElement>(focusableSelector)

      targetElement?.focus()
    })

    return () => {
      if (previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus()
      }
    }
  }, [initialFocusRef, isOpen])

  const onDialogKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>): void => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()

        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) {
        return
      }

      const focusableElements = getFocusableElements(dialogRef.current)

      if (focusableElements.length === 0) {
        event.preventDefault()

        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()

        return
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    },
    [onClose],
  )

  return { dialogRef, onDialogKeyDown }
}
