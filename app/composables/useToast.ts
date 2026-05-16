export type ToastTone = 'default' | 'success' | 'error'

export type Toast = {
  id: number
  message: string
  tone: ToastTone
}

let nextId = 0

export const useToast = () => {
  const toasts = useState<Toast[]>('toasts', () => [])

  function push(message: string, tone: ToastTone = 'default', durationMs = 3200) {
    const id = ++nextId
    toasts.value = [...toasts.value, { id, message, tone }]
    if (import.meta.client) {
      window.setTimeout(() => dismiss(id), durationMs)
    }
    return id
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return {
    toasts,
    push,
    dismiss,
    success: (msg: string, ms?: number) => push(msg, 'success', ms),
    error: (msg: string, ms?: number) => push(msg, 'error', ms),
  }
}
