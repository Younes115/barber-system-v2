import { Scissors, Clock, ArrowLeft } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import PageTransition from '~/components/ui/page-transition'
import { motion } from 'motion/react'
import { type InertiaProps } from '~/types'

interface PackageData {
    id: number
    name: string
    description: string
    price: number
    duration: number | null
    formattedPrice: string
}

export default function PackagesIndex(props: InertiaProps<{ packages: PackageData[] }>) {
    const packages = props.packages ?? []

    return (
        <PageTransition>
            <section className="px-4 pb-8 pt-6 md:pt-10">
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="mb-8 text-center md:mb-12">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm font-semibold text-primary"
                        >
                            خدماتنا
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-2 font-cairo text-3xl font-black md:text-4xl"
                        >
                            باقات <span className="gold-text">الخدمات</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground"
                        >
                            اختر الباقة المناسبة لك واحجز موعدك بسهولة
                        </motion.p>
                    </div>

                    {/* Packages Grid */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {packages.map((pkg, i) => (
                            <motion.div
                                key={pkg.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08, duration: 0.4 }}
                            >
                                <Card className="group relative h-full overflow-hidden border-border bg-card/60 glass transition-all hover:gold-shadow active:scale-[0.98]">
                                    <div className="h-1 w-full gold-gradient opacity-0 transition-opacity group-hover:opacity-100" />
                                    <CardContent className="flex h-full flex-col p-6">
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                                            <Scissors className="h-5 w-5 text-primary" />
                                        </div>

                                        <h3 className="mb-2 font-cairo text-xl font-bold">{pkg.name}</h3>

                                        <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground">
                                            {pkg.description}
                                        </p>

                                        {pkg.duration && (
                                            <div className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span>{pkg.duration} دقيقة</span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between border-t border-border pt-4">
                                            <div>
                                                <span className="text-2xl font-black text-primary">{pkg.price}</span>
                                                <span className="mr-1 text-sm text-muted-foreground">جنيه</span>
                                            </div>
                                            <a href="/bookings/create">
                                                <Button
                                                    size="sm"
                                                    className="h-10 rounded-xl px-5 text-xs shadow-md shadow-primary/15 gold-gradient text-primary-foreground"
                                                >
                                                    احجز الآن <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                                                </Button>
                                            </a>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {packages.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-20 text-center"
                        >
                            <Scissors className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
                            <p className="text-muted-foreground">لا توجد باقات متاحة حالياً</p>
                        </motion.div>
                    )}
                </div>
            </section>
        </PageTransition>
    )
}
