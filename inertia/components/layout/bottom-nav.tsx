// Link from @adonisjs/inertia/react used via <a> for dynamic routes
import { usePage } from '@inertiajs/react'
import {
    Home,
    Scissors,
    Phone,
    CalendarPlus,
    LayoutDashboard,
    CalendarCheck,
    Package,
    User,
} from 'lucide-react'
import { cn } from '~/lib/utils'
import { motion } from 'motion/react'
import { type Data } from '@generated/data'

const userItems = [
    { route: 'home' as const, href: '/', icon: Home, label: 'الرئيسية' },
    { route: 'packages.index' as const, href: '/packages', icon: Scissors, label: 'الخدمات' },
    { route: 'bookings.store' as const, href: '/bookings/create', icon: CalendarPlus, label: 'احجز', isCenter: true },
    { route: 'contact' as const, href: '/contact', icon: Phone, label: 'تواصل' },
    { route: 'profile.show' as const, href: '/profile', icon: User, label: 'حسابي' },
]

const adminItems = [
    { route: 'admin.dashboard' as const, href: '/admin/dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
    { route: 'admin.bookings.today' as const, href: '/admin/bookings/today', icon: CalendarCheck, label: 'الحجوزات' },
    { route: 'admin.packages.index' as const, href: '/admin/packages', icon: Package, label: 'الباقات', isCenter: true },
    { route: 'home' as const, href: '/', icon: Home, label: 'الموقع' },
    { route: 'contact' as const, href: '/contact', icon: Phone, label: 'تواصل' },
]

export default function BottomNav() {
    const { url, props } = usePage<Data.SharedProps>()
    const user = props.user

    const isAdminRoute = url.startsWith('/admin')
    const isAdmin = user?.role === 'admin'
    const items = isAdmin && isAdminRoute ? adminItems : userItems

    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 glass-strong safe-bottom md:hidden">
            <div className="flex items-end justify-around px-2 pb-2 pt-2">
                {items.map((item) => {
                    const isActive = item.href === '/' ? url === '/' : url.startsWith(item.href)

                    if (item.isCenter) {
                        return (
                            <a key={item.href} href={item.href} className="relative -mt-5">
                                <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    className="flex h-14 w-14 items-center justify-center rounded-full gold-gradient shadow-lg shadow-primary/30"
                                >
                                    <item.icon className="h-6 w-6 text-primary-foreground" />
                                </motion.div>
                                <span className="mt-1 block text-center text-[10px] font-medium text-primary">
                                    {item.label}
                                </span>
                            </a>
                        )
                    }

                    return (
                        <a
                            key={item.href}
                            href={item.href}
                            className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 touch-target"
                        >
                            <item.icon
                                className={cn(
                                    'h-5 w-5 transition-colors',
                                    isActive ? 'text-primary' : 'text-muted-foreground'
                                )}
                            />
                            <span
                                className={cn(
                                    'text-[10px] font-medium transition-colors',
                                    isActive ? 'text-primary' : 'text-muted-foreground'
                                )}
                            >
                                {item.label}
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="bottomNavIndicator"
                                    className="absolute -top-1 h-0.5 w-5 rounded-full gold-gradient"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                        </a>
                    )
                })}
            </div>
        </nav>
    )
}
