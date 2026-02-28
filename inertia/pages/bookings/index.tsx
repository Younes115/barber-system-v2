import { Link } from '@adonisjs/inertia/react'
import { Calendar, Scissors, Plus, FileX } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import StatusBadge from '~/components/ui/status-badge'
import PageTransition from '~/components/ui/page-transition'
import { motion } from 'motion/react'
import { DateTime } from 'luxon'
import { type InertiaProps } from '~/types'

interface ServiceItem {
    name: string
    price: number
    packageId?: number
}

interface BookingData {
    id: number
    name: string
    phone: string
    date: string
    time: string
    servicesJson: ServiceItem[]
    status: string
    overbooked: boolean
    isPast: boolean
    isEditable: boolean
    createdAt: string
}

function formatDate(iso: string) {
    return DateTime.fromISO(iso).setLocale('ar').toFormat('EEEE dd MMMM')
}

function BookingCard({ booking }: { booking: BookingData }) {
    const total = booking.servicesJson.reduce((s: number, svc: ServiceItem) => s + svc.price, 0)

    return (
        <Link route="bookings.show" routeParams={[booking.id]}>
            <Card className="border-border bg-card/60 glass transition-all hover:gold-shadow active:scale-[0.98]">
                <CardContent className="p-4">
                    <div className="mb-3 flex items-center justify-between">
                        <StatusBadge status={booking.status} />
                        <span className="text-xs text-muted-foreground" dir="ltr">
                            {booking.time}
                        </span>
                    </div>

                    <div className="mb-2 flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        <span className="text-sm">{formatDate(booking.date)}</span>
                    </div>

                    <div className="mb-3 flex flex-wrap gap-1.5">
                        {booking.servicesJson.map((svc: ServiceItem, i: number) => (
                            <span
                                key={i}
                                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary"
                            >
                                <Scissors className="h-2.5 w-2.5" />
                                {svc.name}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-border pt-2">
                        <span className="text-xs text-muted-foreground">
                            {booking.servicesJson.length} خدمات
                        </span>
                        <span className="text-sm font-bold text-primary">{total} جنيه</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="py-16 text-center">
            <FileX className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    )
}

export default function BookingsIndex(props: InertiaProps<{ bookings: BookingData[] }>) {
    const bookings = props.bookings ?? []
    const upcoming = bookings.filter((b) => !b.isPast && b.status !== 'cancelled')
    const past = bookings.filter((b) => b.isPast || b.status === 'cancelled')

    return (
        <PageTransition>
            <section className="px-4 pb-8 pt-6 md:pt-10">
                <div className="mx-auto max-w-2xl">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <motion.h1
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-cairo text-2xl font-black md:text-3xl"
                        >
                            حجوزاتي
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <a href="/bookings/create">
                                <Button
                                    size="sm"
                                    className="h-10 rounded-xl px-4 text-xs shadow-md shadow-primary/15 gold-gradient text-primary-foreground"
                                >
                                    <Plus className="ml-1 h-4 w-4" />
                                    حجز جديد
                                </Button>
                            </a>
                        </motion.div>
                    </div>

                    {/* Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                    >
                        <Tabs defaultValue="upcoming" dir="rtl">
                            <TabsList className="mb-4 w-full rounded-xl glass">
                                <TabsTrigger value="upcoming" className="flex-1 rounded-lg text-sm">
                                    القادمة ({upcoming.length})
                                </TabsTrigger>
                                <TabsTrigger value="past" className="flex-1 rounded-lg text-sm">
                                    السابقة ({past.length})
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="upcoming">
                                {upcoming.length === 0 ? (
                                    <EmptyState message="ليس لديك حجوزات قادمة" />
                                ) : (
                                    <div className="space-y-3">
                                        {upcoming.map((b, i) => (
                                            <motion.div
                                                key={b.id}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.06 }}
                                            >
                                                <BookingCard booking={b} />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                            <TabsContent value="past">
                                {past.length === 0 ? (
                                    <EmptyState message="لا توجد حجوزات سابقة" />
                                ) : (
                                    <div className="space-y-3">
                                        {past.map((b, i) => (
                                            <motion.div
                                                key={b.id}
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.06 }}
                                            >
                                                <BookingCard booking={b} />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </motion.div>
                </div>
            </section>
        </PageTransition>
    )
}
