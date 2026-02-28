import { useState } from 'react'
import { Link, Form } from '@adonisjs/inertia/react'
import { Eye, EyeOff, Phone, Lock, Scissors } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import PageTransition from '~/components/ui/page-transition'
import { motion } from 'motion/react'
import { type InertiaProps } from '~/types'

export default function LoginPage(props: InertiaProps) {
  const [showPass, setShowPass] = useState(false)
  const errors = props.errors ?? {}

  return (
    <PageTransition>
      <section className="flex min-h-[80vh] items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm space-y-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gold-gradient shadow-lg shadow-primary/20">
              <Scissors className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="font-cairo text-2xl font-black gold-text">تسجيل الدخول</h1>
            <p className="mt-1 text-sm text-muted-foreground">أدخل بياناتك للدخول إلى حسابك</p>
          </motion.div>

          <Form route="session.store" method="post" className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="relative">
                  <Phone className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    name="phone"
                    placeholder="01XXXXXXXXX"
                    dir="ltr"
                    className="h-13 rounded-2xl border-none bg-secondary pr-12 text-start text-base"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs text-destructive">{errors.phone}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="كلمة المرور"
                    className="h-13 rounded-2xl border-none bg-secondary pl-12 pr-12 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-destructive">{errors.password}</p>
                )}
              </div>

              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" name="rememberMe" value="true" className="rounded" />
                تذكرني
              </label>
            </div>

            <Button
              type="submit"
              className="h-13 w-full rounded-2xl text-base font-bold gold-gradient text-primary-foreground"
            >
              تسجيل الدخول
            </Button>
          </Form>

          <p className="text-center text-sm text-muted-foreground">
            ليس لديك حساب؟{' '}
            <Link route="new_account.create" className="font-semibold text-primary hover:underline">
              إنشاء حساب
            </Link>
          </p>
        </div>
      </section>
    </PageTransition>
  )
}
