import { Link } from '@adonisjs/inertia/react'
import { Scissors, Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="border-t border-border bg-card/50 pb-24 md:pb-0">
            <div className="container mx-auto px-4 py-10">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg gold-gradient">
                                <Scissors className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <span className="font-cairo text-lg font-bold gold-text">صالون الحلاقة</span>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            نقدم أفضل خدمات الحلاقة والعناية بالشعر بأيدي محترفين
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-primary">روابط سريعة</h3>
                        <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <Link route="home" className="transition-colors hover:text-primary">
                                الرئيسية
                            </Link>
                            <Link route="packages.index" className="transition-colors hover:text-primary">
                                الخدمات
                            </Link>
                            <Link route="contact" className="transition-colors hover:text-primary">
                                تواصل معنا
                            </Link>
                        </nav>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-primary">التواصل</h3>
                        <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Phone className="h-3.5 w-3.5 text-primary" />
                                <span dir="ltr">+20 123 456 7890</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5 text-primary" />
                                <span>info@barbershop.com</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-primary" />
                                <span>شارع التحرير، القاهرة</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-primary">ساعات العمل</h3>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Clock className="mt-0.5 h-3.5 w-3.5 text-primary" />
                            <div>
                                <p>السبت - الخميس</p>
                                <p>9:00 ص - 9:00 م</p>
                                <p className="mt-1 text-xs text-destructive">الجمعة: مغلق</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-border pt-4 text-center text-xs text-muted-foreground">
                    <p>© {new Date().getFullYear()} صالون الحلاقة. جميع الحقوق محفوظة</p>
                </div>
            </div>
        </footer>
    )
}
