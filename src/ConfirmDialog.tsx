import { useEffect, useRef, useCallback } from 'react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  showDoNotAskAgain?: boolean
  doNotAskAgain?: boolean
  onDoNotAskAgainChange?: (checked: boolean) => void
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  showDoNotAskAgain = false,
  doNotAskAgain = false,
  onDoNotAskAgainChange,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const stableOnCancel = useCallback(() => onCancel(), [onCancel])

  useEffect(() => {
    if (!isOpen) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    cancelRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        stableOnCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [isOpen, stableOnCancel])

  if (!isOpen) return null

  return (
    <div
      className="confirm-overlay"
      role="presentation"
      onClick={stableOnCancel}
    >
      <div
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-title" className="confirm-dialog__title">
          {title}
        </h2>
        <p id="confirm-message" className="confirm-dialog__message">
          {message}
        </p>
        {showDoNotAskAgain && (
          <label className="confirm-dialog__checkbox">
            <input
              type="checkbox"
              checked={doNotAskAgain}
              onChange={(event) => onDoNotAskAgainChange?.(event.target.checked)}
            />
            <span>Do not ask again</span>
          </label>
        )}
        <div className="confirm-dialog__actions">
          <button
            type="button"
            className="confirm-dialog__button confirm-dialog__button--cancel"
            onClick={stableOnCancel}
            ref={cancelRef}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="confirm-dialog__button confirm-dialog__button--confirm"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
