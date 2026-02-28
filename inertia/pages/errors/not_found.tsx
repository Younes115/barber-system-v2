import { Link } from '@adonisjs/inertia/react'
import { Scissors, Home } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { motion } from 'motion/react'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <Scissors className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-cairo text-6xl font-black gold-text">404</h1>
        <p className="mt-3 text-lg font-bold">الصفحة غير موجودة</p>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
        </p>
        <div className="mt-8 flex justify-center gap-3">
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
