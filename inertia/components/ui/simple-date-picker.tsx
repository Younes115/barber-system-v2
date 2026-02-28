import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import { DateTime, Info, Settings } from 'luxon'

// Ensure Luxon uses Arabic locale globally for this component
Settings.defaultLocale = 'ar'

interface SimpleDatePickerProps {
    selected?: string // ISO date string yyyy-MM-dd
    onSelect: (date: string) => void
    minDate?: string // ISO date string yyyy-MM-dd
    maxDate?: string // ISO date string yyyy-MM-dd
}

export default function SimpleDatePicker({
    selected,
    onSelect,
    minDate,
    maxDate,
}: SimpleDatePickerProps) {
    const [currentMonth, setCurrentMonth] = useState(() => {
        if (selected) return DateTime.fromISO(selected).startOf('month')
        return DateTime.now().startOf('month')
    })

    const selectedDt = selected ? DateTime.fromISO(selected) : null
    const minDt = minDate ? DateTime.fromISO(minDate).startOf('day') : null
    const maxDt = maxDate ? DateTime.fromISO(maxDate).startOf('day') : null

    // Weekday headers — Saturday first (Arabic standard)
    const weekDays = useMemo(() => {
        const days = Info.weekdays('short', { locale: 'ar' })
        // Luxon weekdays: Mon=0...Sun=6 → rotate to start from Saturday
        // Saturday is index 5
        return [...days.slice(5), ...days.slice(0, 5)]
    }, [])

    // Generate calendar days
    const calendarDays = useMemo(() => {
        const start = currentMonth.startOf('month')
        const end = currentMonth.endOf('month')

        // Saturday = 6 in Luxon weekday (1=Mon...7=Sun)
        // We want Saturday as first day. Saturday weekday = 6
        const startWeekday = start.weekday // 1-7 Mon-Sun
        // offset: how many blank cells before the 1st
        // If startWeekday = 6 (Sat) → 0 blanks
        // If startWeekday = 7 (Sun) → 1 blank
        // If startWeekday = 1 (Mon) → 2 blanks
        // Formula: (startWeekday - 6 + 7) % 7
        const blankDays = (startWeekday - 6 + 7) % 7

        const days: (DateTime | null)[] = []

        // Blank cells for alignment
        for (let i = 0; i < blankDays; i++) {
            days.push(null)
        }

        // Actual month days
        let day = start
        while (day <= end) {
            days.push(day)
            day = day.plus({ days: 1 })
        }

        return days
    }, [currentMonth])

    const isDisabled = (day: DateTime) => {
        if (minDt && day < minDt) return true
        if (maxDt && day > maxDt) return true
        // Friday is off (weekday 5 in Luxon)
        if (day.weekday === 5) return true
        return false
    }

    const isSelected = (day: DateTime) => {
        return selectedDt ? day.hasSame(selectedDt, 'day') : false
    }

    const isToday = (day: DateTime) => {
        return day.hasSame(DateTime.now(), 'day')
    }

    const prevMonth = () => setCurrentMonth((m) => m.minus({ months: 1 }))
    const nextMonth = () => setCurrentMonth((m) => m.plus({ months: 1 }))

    const monthLabel = currentMonth.setLocale('ar').toFormat('MMMM yyyy')

    const canGoPrev = !minDt || currentMonth > minDt.startOf('month')
    const canGoNext = !maxDt || currentMonth.endOf('month') < maxDt

    return (
        <div className="rounded-3xl glass p-4">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={!canGoPrev}
                    onClick={prevMonth}
                    className="h-9 w-9 rounded-xl"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <h3 className="font-cairo text-sm font-bold">{monthLabel}</h3>
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={!canGoNext}
                    onClick={nextMonth}
                    className="h-9 w-9 rounded-xl"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            </div>

            {/* Weekday headers */}
            <div className="mb-2 grid grid-cols-7 text-center text-[10px] font-semibold text-muted-foreground">
                {weekDays.map((d) => (
                    <span key={d}>{d}</span>
                ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => {
                    if (!day) {
                        return <div key={`blank-${i}`} />
                    }

                    const disabled = isDisabled(day)
                    const sel = isSelected(day)
                    const today = isToday(day)

                    return (
                        <button
                            key={day.toISODate()}
                            type="button"
                            disabled={disabled}
                            onClick={() => onSelect(day.toFormat('yyyy-MM-dd'))}
                            className={cn(
                                'flex h-10 w-full items-center justify-center rounded-xl text-sm font-medium transition-all',
                                disabled && 'cursor-not-allowed opacity-30',
                                !disabled && !sel && 'hover:bg-secondary active:scale-95',
                                sel && 'gold-gradient text-primary-foreground shadow-lg shadow-primary/20',
                                today && !sel && 'ring-1 ring-primary/40'
                            )}
                        >
                            {day.day}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
