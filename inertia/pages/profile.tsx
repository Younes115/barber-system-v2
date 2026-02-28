import { User, Phone, Mail, Calendar, Shield, LogOut } from 'lucide-react'
import { Form } from '@adonisjs/inertia/react'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import PageTransition from '~/components/ui/page-transition'
import { motion } from 'motion/react'
import { DateTime } from 'luxon'
import { type InertiaProps } from '~/types'

interface UserData {
    id: number
    fullName: string
    phone: string
    email: string | null
    role: string
    createdAt: string
    updatedAt: string
    initials: string
}

const roleLabels: Record<string, string> = {
    user: 'عميل',
    admin: 'مدير',
}

export default function Profile(props: InertiaProps<{ user: UserData }>) {
    const { user } = props

    const memberSince = DateTime.fromISO(user.createdAt)
        .setLocale('ar')
        .toFormat('dd MMMM yyyy')

    const infoItems = [
        { icon: User, label: 'الاسم الكامل', value: user.fullName },
        { icon: Phone, label: 'رقم الهاتف', value: user.phone, dir: 'ltr' as const },
        ...(user.email
            ? [{ icon: Mail, label: 'البريد الإلكتروني', value: user.email, dir: 'ltr' as const }]
            : []),
        { icon: Shield, label: 'نوع الحساب', value: roleLabels[user.role] ?? user.role },
        { icon: Calendar, label: 'عضو منذ', value: memberSince },
    ]

    return (
        <PageTransition>
            <section className="px-4 pb-8 pt-6 md:pt-10">
                <div className="mx-auto max-w-lg">
                    {/* Avatar + Name */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 text-center"
                    >
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-black shadow-lg shadow-primary/20 gold-gradient text-primary-foreground">
                            {user.initials}
                        </div>
                        <h1 className="font-cairo text-2xl font-black">{user.fullName}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {roleLabels[user.role] ?? user.role}
                        </p>
                    </motion.div>

                    {/* Info Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="border-border bg-card/60 glass">
                            <CardContent className="p-0">
                                {infoItems.map((item, i) => (
                                    <div key={i}>
                                        <div className="flex items-center gap-4 px-5 py-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                                <item.icon className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-muted-foreground">{item.label}</p>
                                                <p
                                                    className="mt-0.5 text-sm font-medium"
                                                    dir={item.dir}
                                                >
                                                    {item.value}
                                                </p>
                                            </div>
                                        </div>
                                        {i < infoItems.length - 1 && <Separator />}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Logout */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25 }}
                        className="mt-6"
                    >
                        <Form route="session.destroy">
                            <Button
                                type="submit"
                                variant="outline"
                                className="h-12 w-full rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10"
                            >
                                <LogOut className="ml-2 h-4 w-4" />
                                تسجيل الخروج
                            </Button>
                        </Form>
                    </motion.div>
                </div>
            </section>
        </PageTransition>
    )
}
