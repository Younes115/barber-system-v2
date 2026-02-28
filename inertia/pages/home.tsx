import { Link } from '@adonisjs/inertia/react'
import {
  Scissors,
  Calendar,
  Star,
  DollarSign,
  ArrowLeft,
  Sparkles,
  Clock,
  Users,
  Award,
  Phone,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import PageTransition from '~/components/ui/page-transition'
import { motion } from 'motion/react'
import { type InertiaProps } from '~/types'

import heroImage from "~/assets/hero-barbershop.jpg";
import serviceImage from "~/assets/barber-service.jpg";
import toolsImage from "~/assets/barber-tools.jpg";

interface PackageData {
  id: number
  name: string
  description: string
  price: number
  duration: number | null
  formattedPrice: string
}

const features = [
  { icon: Calendar, title: 'حجز سهل', desc: 'احجز موعدك من هاتفك بخطوات بسيطة' },
  { icon: Star, title: 'حلاقين محترفين', desc: 'فريق من أمهر الحلاقين بخبرة سنوات' },
  { icon: Scissors, title: 'أدوات حديثة', desc: 'أحدث الأدوات والمنتجات العالمية' },
  { icon: DollarSign, title: 'أسعار مناسبة', desc: 'خدمات ممتازة بأسعار تناسب الجميع' },
]

const stats = [
  { value: '5000+', label: 'عميل سعيد', icon: Users },
  { value: '10+', label: 'سنوات خبرة', icon: Award },
  { value: '50+', label: 'خدمة متنوعة', icon: Scissors },
  { value: '4.9', label: 'تقييم العملاء', icon: Star },
]

export default function Home(props: InertiaProps<{ packages: PackageData[] }>) {
  const packages = props.packages ?? []

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] overflow-hidden md:min-h-[85vh]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img src={heroImage} alt="صالون الحلاقة الفاخر" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-background/40" />
          <div className="absolute inset-0 bg-linear-to-r from-background/60 to-transparent" />
        </div>

        {/* Decorative Shapes */}
        <div className="absolute right-10 top-10 h-32 w-32 animate-pulse rounded-full border border-primary/20" />
        <div className="absolute right-16 top-20 h-20 w-20 rounded-full border border-primary/10" />
        <div className="absolute bottom-32 left-8 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
        <div className="absolute left-1/4 top-1/3 h-1 w-24 rotate-45 gold-gradient opacity-30" />
        <div className="absolute bottom-1/3 right-1/3 h-1 w-16 -rotate-45 gold-gradient opacity-20" />
        <div className="absolute left-12 top-40 h-8 w-8 rotate-45 border border-primary/25" />
        <div className="absolute bottom-48 right-20 h-6 w-6 rotate-45 bg-primary/10" />

        <div className="relative flex min-h-[90vh] items-end px-4 pb-16 md:min-h-[85vh] md:items-center md:pb-0">
          <div className="mx-auto w-full max-w-6xl">
            <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-4 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-primary"
              >
                <Sparkles className="h-4 w-4" />
                أفضل صالون حلاقة في القاهرة
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="font-cairo text-5xl font-black leading-[1.15] md:text-7xl"
              >
                <span className="gold-text text-glow">صالون</span>
                <br />
                <span className="text-foreground">الحلاقة</span>
                <br />
                <span className="text-3xl font-bold text-muted-foreground md:text-5xl">
                  تجربة فريدة للعناية
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
              >
                نقدم أفضل خدمات الحلاقة والعناية بالشعر واللحية في أجواء فاخرة تليق بك
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <a href="/bookings/create">
                  <Button
                    size="lg"
                    className="h-14 w-full rounded-2xl px-10 text-base font-bold shadow-lg shadow-primary/25 gold-gradient text-primary-foreground sm:w-auto"
                  >
                    احجز موعدك الآن
                  </Button>
                </a>
                <Link route="packages.index">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 w-full rounded-2xl border-primary/20 px-8 text-base hover:bg-primary/5 sm:w-auto"
                  >
                    تصفح الخدمات <ArrowLeft className="mr-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px gold-gradient opacity-30" />
      </section>

      {/* Stats Bar */}
      <section className="relative border-y border-border bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-cairo text-xl font-black text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-14 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative order-2 md:order-1"
            >
              <div className="relative overflow-hidden rounded-3xl">
                <img src={serviceImage} alt="خدمة الحلاقة الاحترافية" className="h-80 w-full object-cover md:h-[480px]" />
                <div className="absolute inset-0 bg-linear-to-t from-background/60 to-transparent" />
              </div>
              <div className="absolute -right-4 -top-4 h-24 w-24 rotate-12 rounded-2xl border-2 border-primary/20" />
              <div className="absolute -bottom-3 -left-3 h-16 w-16 rounded-full gold-gradient opacity-20 blur-sm" />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute -bottom-4 right-4 rounded-2xl glass-strong p-4 shadow-xl md:right-8"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl gold-gradient">
                    <Clock className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">مواعيد مرنة</p>
                    <p className="text-xs text-muted-foreground">9 صباحاً - 9 مساءً</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <div className="order-1 md:order-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-sm font-semibold text-primary">لماذا نحن؟</span>
                <h2 className="mt-2 font-cairo text-3xl font-black md:text-4xl">
                  تجربة حلاقة <span className="gold-text">استثنائية</span>
                </h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  نوفر لك تجربة عناية شخصية لا مثيل لها مع فريق من أمهر الحلاقين
                </p>
              </motion.div>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {features.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                  >
                    <Card className="h-full border-border bg-card/50 glass transition-all hover:gold-shadow active:scale-[0.97]">
                      <CardContent className="flex items-start gap-3 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gold-gradient">
                          <f.icon className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-cairo text-sm font-bold">{f.title}</h3>
                          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                            {f.desc}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative overflow-hidden py-14 md:py-24">
        <div className="absolute inset-0 bg-card/30" />
        <div className="absolute left-0 right-0 top-0 h-px bg-border" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full border border-primary/5" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full border border-primary/5" />

        <div className="relative mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <span className="text-sm font-semibold text-primary">خدماتنا</span>
            <h2 className="mt-2 font-cairo text-3xl font-black md:text-4xl">
              اختر <span className="gold-text">خدمتك</span> المفضلة
            </h2>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {packages.slice(0, 3).map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <Card className="group relative h-full overflow-hidden border-border bg-card/60 glass transition-all hover:gold-shadow active:scale-[0.98]">
                  <div className="h-1 w-full gold-gradient opacity-0 transition-opacity group-hover:opacity-100" />
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                      <Scissors className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="mb-2 font-cairo text-xl font-bold">{pkg.name}</h3>
                    <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                      {pkg.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-black text-primary">{pkg.price}</span>
                        <span className="mr-1 text-sm text-muted-foreground">جنيه</span>
                      </div>
                      <a href="/bookings/create">
                        <Button
                          size="sm"
                          className="h-10 rounded-xl px-5 text-xs shadow-md shadow-primary/15 gold-gradient text-primary-foreground"
                        >
                          احجز الآن
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <Link route="packages.index">
              <Button
                variant="outline"
                size="lg"
                className="rounded-2xl border-primary/20 px-8 hover:bg-primary/5"
              >
                عرض جميع الخدمات
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="px-4 py-14 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-sm font-semibold text-primary">أدواتنا</span>
              <h2 className="mt-2 font-cairo text-3xl font-black md:text-4xl">
                منتجات <span className="gold-text">عالمية</span>
              </h2>
              <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">
                نستخدم أفخر الأدوات والمنتجات العالمية لنضمن لك أفضل نتيجة وأعلى جودة في كل
                زيارة
              </p>

              <div className="mt-6 space-y-3">
                {[
                  'مقصات وأمواس احترافية يابانية',
                  'منتجات عناية بالشعر واللحية فاخرة',
                  'أدوات معقمة بأعلى معايير النظافة',
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <div className="h-2 w-2 shrink-0 rounded-full gold-gradient" />
                    <p className="text-sm text-foreground">{item}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="mt-8"
              >
                <a href="/bookings/create">
                  <Button
                    size="lg"
                    className="h-13 rounded-2xl px-8 font-bold shadow-lg shadow-primary/20 gold-gradient text-primary-foreground"
                  >
                    جرب بنفسك
                  </Button>
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-3xl">
                <img src={toolsImage} alt="أدوات الحلاقة الفاخرة" className="h-72 w-full object-cover md:h-[420px]" />
                <div className="absolute inset-0 bg-linear-to-l from-background/40 to-transparent" />
              </div>
              <div className="absolute -left-3 -top-3 h-20 w-20 rounded-full border border-primary/15" />
              <div className="absolute -bottom-4 -right-4 h-28 w-28 -rotate-12 rounded-2xl border-2 border-primary/10" />
              <div className="absolute -right-2 top-1/2 h-4 w-4 rotate-45 gold-gradient opacity-40" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        <div className="absolute inset-0 gradient-mesh opacity-60" />
        <div className="absolute right-1/4 top-10 h-40 w-40 rounded-full border border-primary/10" />
        <div className="absolute bottom-10 left-1/3 h-24 w-24 rounded-full border border-primary/5" />

        <div className="relative mx-auto max-w-lg text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl glass-strong p-8 md:p-12"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg shadow-primary/20 gold-gradient">
              <Scissors className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="mb-3 font-cairo text-3xl font-black gold-text">جاهز لتجربة فريدة؟</h2>
            <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
              احجز موعدك الآن واستمتع بأفضل خدمة حلاقة وعناية في القاهرة
            </p>
            <a href="/bookings/create" className="block">
              <Button
                size="lg"
                className="h-14 w-full rounded-2xl text-base font-bold shadow-lg shadow-primary/25 gold-gradient text-primary-foreground"
              >
                احجز موعدك الآن
              </Button>
            </a>
            <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span className="text-sm" dir="ltr">
                +20 123 456 7890
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
