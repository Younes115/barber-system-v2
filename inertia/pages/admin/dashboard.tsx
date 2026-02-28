import { Link } from '@adonisjs/inertia/react'
import {
    Calendar,
    Users,
    DollarSign,
    Scissors,
    AlertTriangle,
    Clock,
    CheckCircle,
    XCircle,
    BarChart3,
    Settings,
} from 'lucide-react'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import PageTransition from '~/components/ui/page-transition'
import { motion } from 'motion/react'
import { type InertiaProps } from '~/types'

interface DashboardMetrics {
    todayBookingsCount: number
    upcomingBookingsCount: number
    completedBookingsCount: number
    cancelledBookingsCount: number
    totalUsersCount: number
    totalPackagesCount: number
    overbookedTodayCount: number
    todayRevenue: number
    weekRevenue: number
    monthRevenue: number
    config: {
        slotCapacity: number
        modificationCutoffHours: number
        modificationEnabled: boolean
        allowCapacityOverride: boolean
        timezone: string
    }
}

export default function AdminDashboard(props: InertiaProps<{ metrics: DashboardMetrics }>) {
    const { metrics } = props

    const mainStats = [
        {
            label: 'حجوزات اليوم',
            value: metrics.todayBookingsCount,
            icon: Calendar,
            color: 'text-primary',
            bg: 'bg-primary/10',
        },
        {
            label: 'الحجوزات القادمة',
            value: metrics.upcomingBookingsCount,
            icon: Clock,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
        },
        {
            label: 'إجمالي العملاء',
            value: metrics.totalUsersCount,
            icon: Users,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
        },
        {
            label: 'الباقات المتاحة',
            value: metrics.totalPackagesCount,
            icon: Scissors,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10',
        },
    ]

    const revenueCards = [
        { label: 'إيرادات اليوم', value: metrics.todayRevenue },
        { label: 'إيرادات الأسبوع', value: metrics.weekRevenue },
        { label: 'إيرادات الشهر', value: metrics.monthRevenue },
    ]

    const statusCards = [
        {
            label: 'مكتملة',
            value: metrics.completedBookingsCount,
            icon: CheckCircle,
            color: 'text-emerald-400',
        },
        {
            label: 'ملغية',
            value: metrics.cancelledBookingsCount,
            icon: XCircle,
            color: 'text-red-400',
        },
        {
            label: 'فوق السعة اليوم',
            value: metrics.overbookedTodayCount,
            icon: AlertTriangle,
            color: 'text-amber-400',
        },
    ]

    return (
        <PageTransition>
            <section className="px-4 pb-8 pt-6 md:pt-10">
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 flex flex-wrap items-center justify-between gap-3"
                    >
                        <h1 className="font-cairo text-2xl font-black md:text-3xl">
                            لوحة <span className="gold-text">التحكم</span>
                        </h1>
                        <div className="flex gap-2">
                            <Link route="admin.bookings.today">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl border-primary/20 text-xs"
                                >
                                    <Calendar className="ml-1 h-3.5 w-3.5" />
                                    حجوزات اليوم
                                </Button>
                            </Link>
                            <Link route="admin.packages.index">
                                <Button
                                    size="sm"
                                    className="rounded-xl text-xs gold-gradient text-primary-foreground"
                                >
                                    <Scissors className="ml-1 h-3.5 w-3.5" />
                                    إدارة الباقات
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Main Stats */}
                    <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                        {mainStats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                            >
                                <Card className="border-border bg-card/60 glass">
                                    <CardContent className="p-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                            </div>
                                        </div>
                                        <p className="font-cairo text-2xl font-black">{stat.value}</p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Revenue */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="mb-6"
                    >
                        <h2 className="mb-3 flex items-center gap-2 font-cairo font-bold">
                            <DollarSign className="h-4 w-4 text-primary" />
                            الإيرادات
                        </h2>
                        <div className="grid grid-cols-3 gap-3">
                            {revenueCards.map((r, i) => (
                                <Card key={i} className="border-border bg-card/60 glass">
                                    <CardContent className="p-4 text-center">
                                        <p className="font-cairo text-xl font-black text-primary md:text-2xl">
                                            {r.value.toLocaleString('ar-EG')}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground md:text-xs">{r.label}</p>
                                        <p className="text-[10px] text-muted-foreground">جنيه</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </motion.div>

                    {/* Status Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="mb-6"
                    >
                        <h2 className="mb-3 flex items-center gap-2 font-cairo font-bold">
                            <BarChart3 className="h-4 w-4 text-primary" />
                            حالة الحجوزات
                        </h2>
                        <div className="grid grid-cols-3 gap-3">
                            {statusCards.map((s, i) => (
                                <Card key={i} className="border-border bg-card/60 glass">
                                    <CardContent className="flex items-center gap-3 p-4">
                                        <s.icon className={`h-5 w-5 shrink-0 ${s.color}`} />
                                        <div>
                                            <p className="font-cairo text-xl font-black">{s.value}</p>
                                            <p className="text-xs text-muted-foreground">{s.label}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </motion.div>

                    {/* Config Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                    >
                        <h2 className="mb-3 flex items-center gap-2 font-cairo font-bold">
                            <Settings className="h-4 w-4 text-primary" />
                            إعدادات النظام
                        </h2>
                        <Card className="border-border bg-card/60 glass">
                            <CardContent className="grid gap-3 p-4 sm:grid-cols-2 md:grid-cols-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">سعة الفترة الزمنية</p>
                                    <p className="font-bold">{metrics.config.slotCapacity} حجز</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">مهلة التعديل</p>
                                    <p className="font-bold">{metrics.config.modificationCutoffHours} ساعة</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">تعديل الحجوزات</p>
                                    <p className="font-bold">
                                        {metrics.config.modificationEnabled ? 'مفعّل' : 'معطّل'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">تجاوز السعة</p>
                                    <p className="font-bold">
                                        {metrics.config.allowCapacityOverride ? 'مسموح' : 'غير مسموح'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </section>
        </PageTransition>
    )
}
