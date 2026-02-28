import { Link } from '@adonisjs/inertia/react'
import { Scissors, User } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { usePage } from '@inertiajs/react'
import { type Data } from '@generated/data'

const navLinks = [
    { route: 'home' as const, label: 'الرئيسية', href: '/' },
    { route: 'packages.index' as const, label: 'الخدمات', href: '/packages' },
    { route: 'contact' as const, label: 'تواصل معنا', href: '/contact' },
]

export default function Header() {
    const { url, props } = usePage<Data.SharedProps>()
    const user = props.user

    return (
        <header className="sticky top-0 z-50 glass-strong">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
                {/* Logo */}
                <Link route="home" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg gold-gradient">
                        <Scissors className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="font-cairo text-lg font-bold gold-text">صالون الحلاقة</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-1 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            route={link.route}
                            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all hover:bg-secondary ${url === link.href ? 'bg-secondary text-primary' : 'text-muted-foreground'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {user && (
                        <Link
                            route="bookings.index"
                            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all hover:bg-secondary ${url.startsWith('/bookings') ? 'bg-secondary text-primary' : 'text-muted-foreground'
                                }`}
                        >
                            حجوزاتي
                        </Link>
                    )}
                    {user?.role === 'admin' && (
                        <Link
                            route="admin.dashboard"
                            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all hover:bg-secondary ${url.startsWith('/admin') ? 'bg-secondary text-primary' : 'text-muted-foreground'
                                }`}
                        >
                            لوحة التحكم
                        </Link>
                    )}
                </nav>

                {/* User */}
                <div className="flex items-center gap-2">
                    {user ? (
                        <Link route="profile.show">
                            <Button variant="ghost" size="sm" className="gap-1.5 rounded-xl text-xs">
                                <User className="h-4 w-4" />
                                <span className="hidden sm:inline">{user.fullName ?? user.phone}</span>
                            </Button>
                        </Link>
                    ) : (
                        <Link route="session.create">
                            <Button variant="ghost" size="sm" className="gap-1.5 rounded-xl text-xs">
                                <User className="h-4 w-4" />
                                <span className="hidden sm:inline">تسجيل الدخول</span>
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}
