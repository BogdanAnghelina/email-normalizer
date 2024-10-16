'use client'

import { useState, useEffect } from 'react'
import { createContext, useContext } from 'react'

interface ToastProps {
  title: string;
  description: string;
}

const ToastContext = createContext<{
  toast: ToastProps | null;
  setToast: (toast: ToastProps | null) => void;
} | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastProps | null>(null)

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [toast])

  return (
    <ToastContext.Provider value={{ toast, setToast }}>
      {children}
      {toast && <Toast {...toast} />}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
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