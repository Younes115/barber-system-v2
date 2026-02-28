import { Link, Form } from '@adonisjs/inertia/react'
import {
    Calendar,
    Clock,
    Scissors,
    ArrowRight,
    CheckCircle,
    XCircle,
    AlertCircle,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
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
    userId: number
    name: string
    phone: string
    date: string
    time: string
    servicesJson: ServiceItem[]
    status: string
    overbooked: boolean
    isPast: boolean
    createdAt: string
}

function groupByTime(bookings: BookingData[]) {
    const groups: Record<string, BookingData[]> = {}
    for (const b of bookings) {
        const period = getPeriodLabel(b.time)
        if (!groups[period]) groups[period] = []
        groups[period].push(b)
    }
    return groups
}

function getPeriodLabel(time: string): string {
    const hour = Number.parseInt(time.split(':')[0], 10)
    if (hour < 12) return 'الصباح (9-12)'
    if (hour < 15) return 'الظهر (12-3)'
    if (hour < 18) return 'العصر (3-6)'
    return 'المساء (6-9)'
}

const quickStatuses = [
    { value: 'confirmed', label: 'تأكيد', icon: CheckCircle, cls: 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' },
    { value: 'completed', label: 'مكتمل', icon: CheckCircle, cls: 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' },
    { value: 'no_show', label: 'لم يحضر', icon: AlertCircle, cls: 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' },
    { value: 'cancelled', label: 'إلغاء', icon: XCircle, cls: 'bg-red-500/10 text-red-400 hover:bg-red-500/20' },
]

export default function AdminBookingsToday(props: InertiaProps<{ bookings: BookingData[] }>) {
    const bookings = props.bookings ?? []
    const groups = groupByTime(bookings)
    const today = DateTime.now().setLocale('ar').toFormat('EEEE dd MMMM yyyy')

    return (
        <PageTransition>
            <section className="px-4 pb-8 pt-6 md:pt-10">
                <div className="mx-auto max-w-4xl">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <Link
                            route="admin.dashboard"
                            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowRight className="h-4 w-4" />
                            لوحة التحكم
                        </Link>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="font-cairo text-2xl font-black md:text-3xl">
                                    حجوزات <span className="gold-text">اليوم</span>
                                </h1>
                                <p className="mt-1 text-sm text-muted-foreground">{today}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl gold-gradient text-lg font-black text-primary-foreground">
                                {bookings.length}
                            </div>
                        </div>
                    </motion.div>

                    {bookings.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-20 text-center"
                        >
                            <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
                            <p className="text-muted-foreground">لا توجد حجوزات اليوم</p>
                        </motion.div>
                    ) : (
                        <div className="space-y-6">
                            {Object.entries(groups).map(([period, items], gi) => (
                                <motion.div
                                    key={period}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: gi * 0.1 }}
                                >
                                    <h2 className="mb-3 flex items-center gap-2 font-cairo font-bold">
                                        <Clock className="h-4 w-4 text-primary" />
                                        {period}
                                        <span className="text-sm font-normal text-muted-foreground">
                                            ({items.length})
                                        </span>
                                    </h2>
                                    <div className="space-y-3">
                                        {items.map((booking) => {
                                            const total = booking.servicesJson.reduce((s, svc) => s + svc.price, 0)
                                            return (
                                                <Card
                                                    key={booking.id}
                                                    className="border-border bg-card/60 glass transition-all hover:gold-shadow"
                                                >
                                                    <CardContent className="p-4">
                                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                                            <div className="space-y-2">
                                                                {/* Client */}
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                                                                        {booking.name
                                                                            .split(' ')
                                                                            .map((w) => w[0])
                                                                            .join('')
                                                                            .slice(0, 2)}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-bold">{booking.name}</p>
                                                                        <p className="text-xs text-muted-foreground" dir="ltr">
                                                                            {booking.phone}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {/* Services */}
                                                                <div className="flex flex-wrap gap-1">
                                                                    {booking.servicesJson.map((svc, i) => (
                                                                        <span
                                                                            key={i}
                                                                            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary"
                                                                        >
                                                                            <Scissors className="h-2.5 w-2.5" />
                                                                            {svc.name}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col items-end gap-2">
                                                                <StatusBadge status={booking.status} />
                                                                <span className="text-sm font-bold" dir="ltr">
                                                                    {booking.time}
                                                                </span>
                                                                <span className="text-sm font-bold text-primary">
                                                                    {total} جنيه
                                                                </span>
                                                                {booking.overbooked && (
                                                                    <span className="text-[10px] text-amber-400">فوق السعة</span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Quick status actions */}
                                                        {!['completed', 'cancelled', 'no_show'].includes(booking.status) && (
                                                            <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
                                                                {quickStatuses
                                                                    .filter((s) => s.value !== booking.status)
                                                                    .map((s) => (
                                                                        <Form
                                                                            key={s.value}
                                                                            route="admin.bookings.update_status"
                                                                            routeParams={[booking.id]}
                                                                        >
                                                                            <input type="hidden" name="status" value={s.value} />
                                                                            <Button
                                                                                type="submit"
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className={`h-7 rounded-lg px-2.5 text-[10px] ${s.cls}`}
                                                                            >
                                                                                <s.icon className="ml-1 h-3 w-3" />
                                                                                {s.label}
                                                                            </Button>
                                                                        </Form>
                                                                    ))}
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </PageTransition>
    )
}
