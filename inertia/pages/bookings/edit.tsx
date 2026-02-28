import { useState, useMemo } from 'react'
import { Form } from '@adonisjs/inertia/react'
import {
    Scissors,
    Calendar,
    Clock,
    Check,
    ShoppingCart,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import SimpleDatePicker from '~/components/ui/simple-date-picker'
import PageTransition from '~/components/ui/page-transition'
import { motion } from 'motion/react'
import { DateTime } from 'luxon'
import { type InertiaProps } from '~/types'

interface PackageData {
    id: number
    name: string
    description: string
    price: number
    duration: number | null
    formattedPrice: string
}

interface ServiceItem {
    name: string
    price: number
    packageId?: number
}

interface BookingData {
    id: number
    date: string
    time: string
    servicesJson: ServiceItem[]
    status: string
    isEditable: boolean
}

export default function EditBooking(
    props: InertiaProps<{
        booking: BookingData
        packages: PackageData[]
        timeSlots: string[]
    }>
) {
    const { booking, packages, timeSlots } = props

    const [selectedServices, setSelectedServices] = useState<ServiceItem[]>(
        booking.servicesJson ?? []
    )
    const [selectedDate, setSelectedDate] = useState(booking.date.slice(0, 10))
    const [selectedTime, setSelectedTime] = useState(booking.time)

    const total = useMemo(
        () => selectedServices.reduce((s, svc) => s + svc.price, 0),
        [selectedServices]
    )

    const minDate = DateTime.now().plus({ days: 1 }).toISODate()!
    const maxDate = DateTime.now().plus({ days: 30 }).toISODate()!

    function toggleService(pkg: PackageData) {
        setSelectedServices((prev) => {
            const exists = prev.find((s) => s.packageId === pkg.id)
            if (exists) return prev.filter((s) => s.packageId !== pkg.id)
            return [...prev, { name: pkg.name, price: pkg.price, packageId: pkg.id }]
        })
    }

    function isSelected(id: number) {
        return selectedServices.some((s) => s.packageId === id)
    }

    return (
        <PageTransition>
            <section className="px-4 pb-8 pt-6 md:pt-10">
                <div className="mx-auto max-w-2xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 font-cairo text-2xl font-black md:text-3xl"
                    >
                        تعديل <span className="gold-text">الحجز</span>
                    </motion.h1>

                    {/* Services */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                    >
                        <h3 className="mb-3 flex items-center gap-2 font-cairo font-bold">
                            <Scissors className="h-4 w-4 text-primary" />
                            الخدمات
                        </h3>
                        <div className="space-y-2">
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
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all ${isSelected(pkg.id)
                                                    ? 'gold-gradient text-primary-foreground'
                                                    : 'bg-primary/10'
                                                }`}
                                        >
                                            {isSelected(pkg.id) ? (
                                                <Check className="h-4 w-4" />
                                            ) : (
                                                <Scissors className="h-3.5 w-3.5 text-primary" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <span className="text-sm font-bold">{pkg.name}</span>
                                        </div>
                                        <span className="text-sm font-bold text-primary">{pkg.price} جنيه</span>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {selectedServices.length > 0 && (
                            <div className="mt-3 flex items-center justify-between rounded-xl glass p-3">
                                <div className="flex items-center gap-2">
                                    <ShoppingCart className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-bold">{selectedServices.length} خدمة</span>
                                </div>
                                <span className="text-lg font-black text-primary">{total} جنيه</span>
                            </div>
                        )}
                    </motion.div>

                    {/* Date */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-6"
                    >
                        <Card className="border-border bg-card/60 glass">
                            <CardContent className="p-4">
                                <div className="mb-3 flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <h3 className="font-cairo font-bold">التاريخ</h3>
                                </div>
                                <SimpleDatePicker
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    minDate={minDate}
                                    maxDate={maxDate}
                                />
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Time */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="mt-4"
                    >
                        <Card className="border-border bg-card/60 glass">
                            <CardContent className="p-4">
                                <div className="mb-3 flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <h3 className="font-cairo font-bold">الوقت</h3>
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

                    {/* Submit */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6"
                    >
                        <Form route="bookings.update" routeParams={[booking.id]}>
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
                                disabled={selectedServices.length === 0 || !selectedDate || !selectedTime}
                                className="h-14 w-full rounded-2xl text-base font-bold shadow-lg shadow-primary/25 gold-gradient text-primary-foreground disabled:opacity-40"
                            >
                                حفظ التعديلات
                            </Button>
                        </Form>
                    </motion.div>
                </div>
            </section>
        </PageTransition>
    )
}
