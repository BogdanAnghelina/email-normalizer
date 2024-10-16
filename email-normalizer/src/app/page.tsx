import EmailNormalizer from '../components/EmailNormalizer'
import { ToastProvider } from '../components/use-toast'

export default function Home() {
  return (
    <ToastProvider>
      <main className="min-h-screen bg-gray-100">
        <EmailNormalizer />
      </main>
    </ToastProvider>
  )
}