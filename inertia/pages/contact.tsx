import { Phone, MapPin, Clock, Send, Instagram, MessageCircle } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import PageTransition from '~/components/ui/page-transition'
import { motion } from 'motion/react'
import { type InertiaProps } from '~/types'

const contactInfo = [
    {
        icon: Phone,
        title: 'اتصل بنا',
        details: ['+20 123 456 7890'],
        dir: 'ltr' as const,
    },
    {
        icon: MapPin,
        title: 'العنوان',
        details: ['شارع التحرير، وسط البلد', 'القاهرة، مصر'],
        dir: 'rtl' as const,
    },
    {
        icon: Clock,
        title: 'ساعات العمل',
        details: ['السبت - الخميس: 9 صباحاً - 9 مساءً', 'الجمعة: عطلة'],
        dir: 'rtl' as const,
    },
]

const socialLinks = [
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: MessageCircle, label: 'WhatsApp', href: '#' },
    { icon: Phone, label: 'هاتف', href: 'tel:+201234567890' },
]

export default function Contact(_props: InertiaProps) {
    return (
        <PageTransition>
            <section className="px-4 pb-8 pt-6 md:pt-10">
                <div className="mx-auto max-w-5xl">
                    {/* Header */}
                    <div className="mb-8 text-center md:mb-12">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm font-semibold text-primary"
                        >
                            تواصل معنا
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-2 font-cairo text-3xl font-black md:text-4xl"
                        >
                            نسعد <span className="gold-text">بتواصلك</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground"
                        >
                            لأي استفسار أو اقتراح، لا تتردد في التواصل معنا
                        </motion.p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-5">
                        {/* Contact Info Cards */}
                        <div className="space-y-4 md:col-span-2">
                            {contactInfo.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.4 }}
                                >
                                    <Card className="border-border bg-card/60 glass">
                                        <CardContent className="flex items-start gap-4 p-5">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gold-gradient">
                                                <item.icon className="h-5 w-5 text-primary-foreground" />
                                            </div>
                                            <div>
                                                <h3 className="font-cairo font-bold">{item.title}</h3>
                                                {item.details.map((d, j) => (
                                                    <p
                                                        key={j}
                                                        className="mt-0.5 text-sm text-muted-foreground"
                                                        dir={item.dir}
                                                    >
                                                        {d}
                                                    </p>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}

                            {/* Social Links */}
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Card className="border-border bg-card/60 glass">
                                    <CardContent className="p-5">
                                        <h3 className="mb-3 font-cairo font-bold">تابعنا</h3>
                                        <div className="flex gap-3">
                                            {socialLinks.map((s, i) => (
                                                <a
                                                    key={i}
                                                    href={s.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/80 transition-all hover:gold-shadow hover:border-primary/30"
                                                >
                                                    <s.icon className="h-4 w-4 text-muted-foreground" />
                                                </a>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Contact Form (decorative — no backend) */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="md:col-span-3"
                        >
                            <Card className="border-border bg-card/60 glass">
                                <CardContent className="p-6 md:p-8">
                                    <h3 className="mb-6 font-cairo text-xl font-bold">أرسل رسالة</h3>
                                    <div className="space-y-4">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>الاسم</Label>
                                                <Input placeholder="أدخل اسمك" className="rounded-xl" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>رقم الهاتف</Label>
                                                <Input
                                                    placeholder="01xxxxxxxxx"
                                                    dir="ltr"
                                                    className="rounded-xl text-right"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>الموضوع</Label>
                                            <Input placeholder="موضوع الرسالة" className="rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>الرسالة</Label>
                                            <Textarea
                                                placeholder="اكتب رسالتك هنا..."
                                                className="min-h-32 rounded-xl"
                                            />
                                        </div>
                                        <Button className="h-12 w-full rounded-xl text-base font-bold shadow-md shadow-primary/20 gold-gradient text-primary-foreground">
                                            <Send className="ml-2 h-4 w-4" />
                                            إرسال الرسالة
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>
        </PageTransition>
    )
}
