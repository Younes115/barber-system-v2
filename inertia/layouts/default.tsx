import { Data } from '@generated/data'
import { toast, Toaster } from 'sonner'
import { usePage } from '@inertiajs/react'
import { ReactElement, useEffect } from 'react'
import Header from '~/components/layout/header'
import Footer from '~/components/layout/footer'
import BottomNav from '~/components/layout/bottom-nav'

export default function Layout({ children }: { children: ReactElement<Data.SharedProps> }) {
  const { url } = usePage()

  useEffect(() => {
    toast.dismiss()
  }, [url])

  if (children.props.flash?.error) {
    toast.error(children.props.flash.error)
  }

  if (children.props.flash?.success) {
    toast.success(children.props.flash.success)
  }

  return (
    <div className="flex min-h-screen flex-col has-bottom-nav">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <BottomNav />
      <Toaster position="top-center" richColors theme="dark" />
    </div>
  )
}
