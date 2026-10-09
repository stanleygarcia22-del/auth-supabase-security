'use client'

import { useFormStatus } from 'react-dom'

interface SubmitButtonProps {
  formAction: (formData: FormData) => Promise<void>
  pendingText?: string
  children: React.ReactNode
  className?: string
}

export function SubmitButton({
  formAction,
  pendingText = 'Procesando...',
  children,
  className = '',
}: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      formAction={formAction}
      disabled={pending}
      className={`${className} ${pending ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="h-4 w-4 animate-spin text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {pendingText}
        </span>
      ) : (
        children
      )}
    </button>
  )
}