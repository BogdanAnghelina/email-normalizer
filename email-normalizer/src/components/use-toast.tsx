import { useState, useEffect } from 'react'

interface ToastProps {
  title: string;
  description: string;
}

export function useToast() {
  const [toast, setToast] = useState<ToastProps | null>(null)

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [toast])

  return { toast, setToast }
}

export function Toast({ title, description }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg">
      <h3 className="font-bold">{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export function toast(props: ToastProps) {
  const { setToast } = useToast()
  setToast(props)
}