import { Link } from '@adonisjs/inertia/react'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { motion } from 'motion/react'

export default function ServerError() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="font-cairo text-6xl font-black text-destructive">500</h1>
        <p className="mt-3 text-lg font-bold">حدث خطأ في الخادم</p>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقاً
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button
            variant="outline"
            className="h-12 rounded-xl border-primary/20 px-6"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="ml-2 h-4 w-4" />
            إعادة المحاولة
          </Button>
          <Link route="home">
            <Button className="h-12 rounded-xl px-6 gold-gradient text-primary-foreground">
              <Home className="ml-2 h-4 w-4" />
              الصفحة الرئيسية
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
