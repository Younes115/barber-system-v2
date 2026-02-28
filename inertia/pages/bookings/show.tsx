import { Link, Form } from '@adonisjs/inertia/react'
import {
    Calendar,
    Clock,
    Scissors,
    User,
    Phone,
    Edit,
    Trash2,
    ArrowRight,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
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

export default function BookingShow(props: InertiaProps<{ booking: BookingData }>) {
    const { booking } = props
    const total = booking.servicesJson.reduce((s, svc) => s + svc.price, 0)

    const formattedDate = DateTime.fromISO(booking.date)
        .setLocale('ar')
        .toFormat('EEEE dd MMMM yyyy')

    const createdDate = DateTime.fromISO(booking.createdAt)
        .setLocale('ar')
        .toFormat('dd MMMM yyyy')

    return (
        <PageTransition>
            <section className="px-4 pb-8 pt-6 md:pt-10">
                <div className="mx-auto max-w-lg">
                    {/* Back Link */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
                        <Link
                            route="bookings.index"
                            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowRight className="h-4 w-4" />
                            العودة للحجوزات
                        </Link>
                    </motion.div>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 flex items-center justify-between"
                    >
                        <h1 className="font-cairo text-2xl font-black">تفاصيل الحجز</h1>
                        <StatusBadge status={booking.status} />
                    </motion.div>

                    {/* Booking Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="border-border bg-card/60 glass">
                            <CardContent className="space-y-4 p-5">
                                {/* Date & Time */}
                                <div className="flex items-center gap-4 rounded-xl bg-primary/5 p-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-medium">{formattedDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-bold" dir="ltr">
                                            {booking.time}
                                        </span>
                                    </div>
                                </div>

                                {/* Client Info */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{booking.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm" dir="ltr">
                                            {booking.phone}
                                        </span>
                                    </div>
                                </div>

                                {/* Services */}
                                <div>
                                    <h3 className="mb-2 flex items-center gap-2 font-cairo text-sm font-bold">
                                        <Scissors className="h-4 w-4 text-primary" />
                                        الخدمات المحجوزة
                                    </h3>
                                    <div className="space-y-2">
                                        {booking.servicesJson.map((svc, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between rounded-lg bg-card/80 p-3"
                                            >
                                                <span className="text-sm">{svc.name}</span>
                                                <span className="text-sm font-bold text-primary">{svc.price} جنيه</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="flex items-center justify-between border-t border-border pt-4">
                                    <span className="font-cairo font-bold">الإجمالي</span>
                                    <div>
                                        <span className="text-2xl font-black text-primary">{total}</span>
                                        <span className="mr-1 text-sm text-muted-foreground">جنيه</span>
                                    </div>
                                </div>

                                {/* Meta */}
                                <p className="text-xs text-muted-foreground">تم الحجز: {createdDate}</p>
                                {booking.overbooked && (
                                    <p className="text-xs text-amber-400">⚠ تم الحجز فوق السعة</p>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Actions */}
                    {booking.isEditable && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-4 flex gap-3"
                        >
                            <Link route="bookings.edit" routeParams={[booking.id]} className="flex-1">
                                <Button
                                    variant="outline"
                                    className="h-12 w-full rounded-xl border-primary/20 hover:bg-primary/5"
                                >
                                    <Edit className="ml-2 h-4 w-4" />
                                    تعديل الحجز
                                </Button>
                            </Link>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="h-12 rounded-xl border-destructive/30 px-5 text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="glass-strong">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="font-cairo">إلغاء الحجز</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            هل أنت متأكد من إلغاء هذا الحجز؟ لا يمكن التراجع عن هذا الإجراء.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="gap-2">
                                        <AlertDialogCancel className="rounded-xl">تراجع</AlertDialogCancel>
                                        <Form route="bookings.destroy" routeParams={[booking.id]}>
                                            <AlertDialogAction
                                                type="submit"
                                                className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                نعم، إلغاء الحجز
                                            </AlertDialogAction>
                                        </Form>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </motion.div>
                    )}
                </div>
            </section>
        </PageTransition>
    )
}
