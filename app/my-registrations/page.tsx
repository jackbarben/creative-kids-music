import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { EmailRequestForm } from './EmailRequestForm'

export const metadata = {
  title: 'My Registrations | Creative Kids Music',
  description: 'View and manage your Creative Kids Music registrations',
}

export default function MyRegistrationsPage() {
  return (
    <>
      <Header />
      <main className="min-h-[60vh] py-16 px-6 bg-cream-50">
        <div className="max-w-md mx-auto">
          <h1 className="font-syne text-3xl font-bold text-stone-800 mb-4 text-center">
            My Registrations
          </h1>
          <p className="text-stone-600 mb-8 text-center">
            Enter your email to receive a secure link to view and manage your registrations.
          </p>

          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <EmailRequestForm />
          </div>

          <p className="text-sm text-stone-500 mt-6 text-center">
            The link will be valid for 24 hours. If you don&apos;t receive an email,
            check your spam folder or contact us at{' '}
            <a href="mailto:info@creativekidsmusic.org" className="text-forest-600 hover:underline">
              info@creativekidsmusic.org
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
