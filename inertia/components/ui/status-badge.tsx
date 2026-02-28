import { Badge } from '~/components/ui/badge'
import { cn } from '~/lib/utils'

const statusConfig: Record<string, { label: string; cls: string }> = {
    pending: { label: 'قيد الانتظار', cls: 'bg-amber-500/15 text-amber-400' },
    confirmed: { label: 'مؤكد', cls: 'gold-gradient text-primary-foreground' },
    completed: { label: 'مكتمل', cls: 'bg-green-500/15 text-green-400' },
    cancelled: { label: 'ملغي', cls: 'bg-destructive/15 text-destructive' },
    no_show: { label: 'لم يحضر', cls: 'bg-muted text-muted-foreground' },
}

interface StatusBadgeProps {
    status: string
    className?: string
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status] ?? { label: status, cls: 'bg-muted text-muted-foreground' }

    return (
        <Badge variant="secondary" className={cn('rounded-lg text-[10px]', config.cls, className)}>
            {config.label}
        </Badge>
    )
}
