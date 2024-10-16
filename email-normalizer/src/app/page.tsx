import EmailNormalizer from '../components/EmailNormalizer'
import { Toast, useToast } from '../components/use-toast'

export default function Home() {
  const { toast } = useToast()

  return (
    <main className="min-h-screen bg-gray-100">
      <EmailNormalizer />
      {toast && <Toast {...toast} />}
    </main>
  )
}