import { useState } from 'react'
import { Form } from '@adonisjs/inertia/react'
import { Link } from '@adonisjs/inertia/react'
import {
    Plus,
    Edit,
    Trash2,
    Scissors,
    Clock,
    ArrowRight,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '~/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import PageTransition from '~/components/ui/page-transition'
import { motion } from 'motion/react'
import { type InertiaProps } from '~/types'

interface PackageData {
    id: number
    name: string
    description: string
    price: number
    duration: number | null
    formattedPrice: string
}

export default function AdminPackagesIndex(
    props: InertiaProps<{ packages: PackageData[] }>
) {
    const packages = props.packages ?? []
    const [createOpen, setCreateOpen] = useState(false)
    const [editPkg, setEditPkg] = useState<PackageData | null>(null)

    return (
        <PageTransition>
            <section className="px-4 pb-8 pt-6 md:pt-10">
                <div className="mx-auto max-w-4xl">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <Link
                            route="admin.dashboard"
                            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowRight className="h-4 w-4" />
                            لوحة التحكم
                        </Link>
                        <div className="flex items-center justify-between">
                            <h1 className="font-cairo text-2xl font-black md:text-3xl">
                                إدارة <span className="gold-text">الباقات</span>
                            </h1>
                            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        size="sm"
                                        className="rounded-xl text-xs gold-gradient text-primary-foreground"
                                    >
                                        <Plus className="ml-1 h-4 w-4" />
                                        باقة جديدة
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="glass-strong sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="font-cairo">إضافة باقة جديدة</DialogTitle>
                                    </DialogHeader>
                                    <Form
                                        route="admin.packages.store"
                                        onSuccess={() => setCreateOpen(false)}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <Label>اسم الباقة</Label>
                                            <Input name="name" placeholder="مثال: قص شعر" className="rounded-xl" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>الوصف</Label>
                                            <Textarea
                                                name="description"
                                                placeholder="وصف مختصر للباقة"
                                                className="min-h-20 rounded-xl"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label>السعر (جنيه)</Label>
                                                <Input
                                                    name="price"
                                                    type="number"
                                                    min="1"
                                                    step="0.01"
                                                    placeholder="0"
                                                    className="rounded-xl"
                                                    dir="ltr"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>المدة (دقيقة)</Label>
                                                <Input
                                                    name="duration"
                                                    type="number"
                                                    min="5"
                                                    step="5"
                                                    placeholder="30"
                                                    className="rounded-xl"
                                                    dir="ltr"
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            type="submit"
                                            className="h-12 w-full rounded-xl font-bold gold-gradient text-primary-foreground"
                                        >
                                            إضافة الباقة
                                        </Button>
                                    </Form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </motion.div>

                    {/* Packages List */}
                    <div className="space-y-3">
                        {packages.map((pkg, i) => (
                            <motion.div
                                key={pkg.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card className="border-border bg-card/60 glass transition-all hover:gold-shadow">
                                    <CardContent className="flex items-center gap-4 p-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                            <Scissors className="h-5 w-5 text-primary" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-cairo text-sm font-bold">{pkg.name}</h3>
                                            <p className="truncate text-xs text-muted-foreground">{pkg.description}</p>
                                            <div className="mt-1 flex items-center gap-3">
                                                <span className="text-sm font-bold text-primary">{pkg.price} جنيه</span>
                                                {pkg.duration && (
                                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        {pkg.duration} د
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {/* Edit */}
                                            <Dialog
                                                open={editPkg?.id === pkg.id}
                                                onOpenChange={(open: boolean) => setEditPkg(open ? pkg : null)}
                                            >
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg p-0">
                                                        <Edit className="h-4 w-4 text-muted-foreground" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="glass-strong sm:max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle className="font-cairo">تعديل الباقة</DialogTitle>
                                                    </DialogHeader>
                                                    <Form
                                                        route="admin.packages.update"
                                                        routeParams={[pkg.id]}
                                                        onSuccess={() => setEditPkg(null)}
                                                        className="space-y-4"
                                                    >
                                                        <div className="space-y-2">
                                                            <Label>اسم الباقة</Label>
                                                            <Input
                                                                name="name"
                                                                defaultValue={pkg.name}
                                                                className="rounded-xl"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>الوصف</Label>
                                                            <Textarea
                                                                name="description"
                                                                defaultValue={pkg.description}
                                                                className="min-h-20 rounded-xl"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="space-y-2">
                                                                <Label>السعر (جنيه)</Label>
                                                                <Input
                                                                    name="price"
                                                                    type="number"
                                                                    min="1"
                                                                    step="0.01"
                                                                    defaultValue={pkg.price}
                                                                    className="rounded-xl"
                                                                    dir="ltr"
                                                                    required
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>المدة (دقيقة)</Label>
                                                                <Input
                                                                    name="duration"
                                                                    type="number"
                                                                    min="5"
                                                                    step="5"
                                                                    defaultValue={pkg.duration ?? ''}
                                                                    className="rounded-xl"
                                                                    dir="ltr"
                                                                />
                                                            </div>
                                                        </div>
                                                        <Button
                                                            type="submit"
                                                            className="h-12 w-full rounded-xl font-bold gold-gradient text-primary-foreground"
                                                        >
                                                            حفظ التعديلات
                                                        </Button>
                                                    </Form>
                                                </DialogContent>
                                            </Dialog>

                                            {/* Delete */}
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg p-0">
                                                        <Trash2 className="h-4 w-4 text-destructive/70" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="glass-strong">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className="font-cairo">حذف الباقة</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            هل أنت متأكد من حذف باقة "{pkg.name}"؟ لا يمكن التراجع عن هذا الإجراء.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter className="gap-2">
                                                        <AlertDialogCancel className="rounded-xl">تراجع</AlertDialogCancel>
                                                        <Form route="admin.packages.destroy" routeParams={[pkg.id]}>
                                                            <AlertDialogAction
                                                                type="submit"
                                                                className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                نعم، حذف الباقة
                                                            </AlertDialogAction>
                                                        </Form>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {packages.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-20 text-center"
                        >
                            <Scissors className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
                            <p className="text-muted-foreground">لا توجد باقات بعد</p>
                        </motion.div>
                    )}
                </div>
            </section>
        </PageTransition>
    )
}
