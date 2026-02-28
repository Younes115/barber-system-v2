import { useState, useMemo } from 'react'
import { Form } from '@adonisjs/inertia/react'
import {
    Scissors,
    Calendar,
    Clock,
    Check,
    ArrowRight,
    ArrowLeft,
    ShoppingCart,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import SimpleDatePicker from '~/components/ui/simple-date-picker'
import PageTransition from '~/components/ui/page-transition'
import { motion, AnimatePresence } from 'motion/react'
import { DateTime } from 'luxon'
import { type InertiaProps } from '~/types'
import { Data } from '@generated/data'

interface SelectedService {
    name: string
    price: number
    packageId?: number
}

const steps = ['اختر الخدمات', 'حدد الموعد', 'تأكيد الحجز']

export default function CreateBooking(
    props: InertiaProps<{ packages: Data.Package[]; timeSlots: string[] }>
) {
    const { packages, timeSlots } = props
    const [step, setStep] = useState(0)
    const [selectedServices, setSelectedServices] = useState<SelectedService[]>([])
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')

    const total = useMemo(() => selectedServices.reduce((s, svc) => s + svc.price, 0), [selectedServices])

    const minDate = DateTime.now().plus({ days: 1 }).toISODate()!
    const maxDate = DateTime.now().plus({ days: 30 }).toISODate()!

    function toggleService(pkg: Data.Package) {
        setSelectedServices((prev) => {
            const exists = prev.find((s) => s.packageId === pkg.id)
            if (exists) return prev.filter((s) => s.packageId !== pkg.id)
            return [...prev, { name: pkg.name, price: pkg.price, packageId: pkg.id }]
        })
    }

    function isSelected(id: number) {
        return selectedServices.some((s) => s.packageId === id)
    }

    const canNext =
        (step === 0 && selectedServices.length > 0) ||
        (step === 1 && selectedDate && selectedTime)

    return (
        <PageTransition>
            <section className="px-4 pb-8 pt-6 md:pt-10">
                <div className="mx-auto max-w-2xl">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                        <h1 className="font-cairo text-2xl font-black md:text-3xl">
                            حجز <span className="gold-text">موعد جديد</span>
                        </h1>
                    </motion.div>

                    {/* Steps Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="mb-8"
                    >
                        <div className="flex items-center justify-between">
                            {steps.map((label, i) => (
                                <div key={i} className="flex flex-1 items-center">
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div
                                            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all ${i < step
                                                ? 'gold-gradient text-primary-foreground'
                                                : i === step
                                                    ? 'border-2 border-primary text-primary'
                                                    : 'border border-border text-muted-foreground'
                                                }`}
                                        >
                                            {i < step ? <Check className="h-4 w-4" /> : i + 1}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground md:text-xs">{label}</span>
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div className="mx-2 h-px flex-1 bg-border" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {/* Step 1: Select Services */}
                        {step === 0 && (
                            <motion.div
                                key="step-0"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                            >
                                <div className="space-y-3">
                                    {packages.map((pkg) => (
                                        <Card
                                            key={pkg.id}
                                            className={`cursor-pointer border transition-all active:scale-[0.98] ${isSelected(pkg.id)
                                                ? 'border-primary gold-shadow bg-primary/5'
                                                : 'border-border bg-card/60 glass hover:border-primary/30'
                                                }`}
                                            onClick={() => toggleService(pkg)}
                                        >
                                            <CardContent className="flex items-center gap-4 p-4">
                                                <div
                                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${isSelected(pkg.id)
                                                        ? 'gold-gradient text-primary-foreground'
                                                        : 'bg-primary/10'
                                                        }`}
                                                >
                                                    {isSelected(pkg.id) ? (
                                                        <Check className="h-4 w-4" />
                                                    ) : (
                                                        <Scissors className="h-4 w-4 text-primary" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-cairo text-sm font-bold">{pkg.name}</h3>
                                                    <p className="text-xs text-muted-foreground">{pkg.description}</p>
                                                </div>
                                                <div className="text-left">
                                                    <span className="font-cairo text-lg font-black text-primary">
                                                        {pkg.price}
                                                    </span>
                                                    <span className="mr-0.5 text-xs text-muted-foreground">جنيه</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {selectedServices.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-4 rounded-xl glass p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <ShoppingCart className="h-4 w-4 text-primary" />
                                                <span className="text-sm font-bold">
                                                    {selectedServices.length} خدمة
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-xl font-black text-primary">{total}</span>
                                                <span className="mr-1 text-sm text-muted-foreground">جنيه</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* Step 2: Date & Time */}
                        {step === 1 && (
                            <motion.div
                                key="step-1"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                            >
                                {/* Date */}
                                <Card className="border-border bg-card/60 glass">
                                    <CardContent className="p-4">
                                        <div className="mb-3 flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-primary" />
                                            <h3 className="font-cairo font-bold">اختر التاريخ</h3>
                                        </div>
                                        <SimpleDatePicker
                                            selected={selectedDate}
                                            onSelect={setSelectedDate}
                                            minDate={minDate}
                                            maxDate={maxDate}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Time */}
                                {selectedDate && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <Card className="mt-4 border-border bg-card/60 glass">
                                            <CardContent className="p-4">
                                                <div className="mb-3 flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-primary" />
                                                    <h3 className="font-cairo font-bold">اختر الوقت</h3>
                                                </div>
                                                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                                                    {timeSlots.map((slot) => (
                                                        <button
                                                            key={slot}
                                                            type="button"
                                                            onClick={() => setSelectedTime(slot)}
                                                            className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-all active:scale-95 ${selectedTime === slot
                                                                ? 'gold-gradient text-primary-foreground shadow-md shadow-primary/20'
                                                                : 'glass hover:bg-primary/5'
                                                                }`}
                                                        >
                                                            {slot}
                                                        </button>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* Step 3: Confirm */}
                        {step === 2 && (
                            <motion.div
                                key="step-2"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                            >
                                <Card className="border-border bg-card/60 glass">
                                    <CardContent className="p-5">
                                        <h3 className="mb-4 font-cairo text-lg font-bold">ملخص الحجز</h3>

                                        {/* Date & Time */}
                                        <div className="mb-4 flex items-center gap-4 rounded-xl bg-primary/5 p-3">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-primary" />
                                                <span className="text-sm">
                                                    {DateTime.fromISO(selectedDate).setLocale('ar').toFormat('EEEE dd MMMM yyyy')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-primary" />
                                                <span className="text-sm font-medium" dir="ltr">
                                                    {selectedTime}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Services */}
                                        <div className="space-y-2">
                                            {selectedServices.map((svc, i) => (
                                                <div key={i} className="flex items-center justify-between rounded-lg p-2">
                                                    <div className="flex items-center gap-2">
                                                        <Scissors className="h-3.5 w-3.5 text-primary" />
                                                        <span className="text-sm">{svc.name}</span>
                                                    </div>
                                                    <span className="text-sm font-bold text-primary">{svc.price} جنيه</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                                            <span className="font-cairo font-bold">الإجمالي</span>
                                            <div>
                                                <span className="text-2xl font-black text-primary">{total}</span>
                                                <span className="mr-1 text-sm text-muted-foreground">جنيه</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Submit Form */}
                                <Form route="bookings.store" className="mt-4">
                                    <input type="hidden" name="date" value={selectedDate} />
                                    <input type="hidden" name="time" value={selectedTime} />
                                    {selectedServices.map((svc, i) => (
                                        <div key={i}>
                                            <input type="hidden" name={`services[${i}][name]`} value={svc.name} />
                                            <input type="hidden" name={`services[${i}][price]`} value={svc.price} />
                                            {svc.packageId && (
                                                <input
                                                    type="hidden"
                                                    name={`services[${i}][packageId]`}
                                                    value={svc.packageId}
                                                />
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        type="submit"
                                        className="h-14 w-full rounded-2xl text-base font-bold shadow-lg shadow-primary/25 gold-gradient text-primary-foreground"
                                    >
                                        تأكيد الحجز
                                    </Button>
                                </Form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="mt-6 flex gap-3">
                        {step > 0 && (
                            <Button
                                variant="outline"
                                onClick={() => setStep(step - 1)}
                                className="h-12 flex-1 rounded-xl border-primary/20"
                            >
                                <ArrowRight className="ml-2 h-4 w-4" />
                                السابق
                            </Button>
                        )}
                        {step < 2 && (
                            <Button
                                onClick={() => setStep(step + 1)}
                                disabled={!canNext}
                                className="h-12 flex-1 rounded-xl gold-gradient text-primary-foreground disabled:opacity-40"
                            >
                                التالي
                                <ArrowLeft className="mr-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </section>
        </PageTransition>
    )
}
