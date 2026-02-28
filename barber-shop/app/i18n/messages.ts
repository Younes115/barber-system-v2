/**
 * Centralised Arabic messages for validation, domain errors, and flash feedback.
 *
 * Every user-facing backend string lives here so that:
 *  1. Translators only need to touch one file.
 *  2. Controllers / services import a short key instead of hard-coded text.
 *
 * Keys follow the convention  <domain>.<context>.<specificError>
 */

// ─── Vine field-level validation messages ───────────────────────────────────────
// Format accepted by VineJS `messages` option:
//   { 'rule': 'global msg', 'field.rule': 'field-specific msg' }

export const vineMessages = {
  // ── Global rules ────────────────────────────────────────────────────────────
  'required': 'هذا الحقل مطلوب',
  'string': 'يجب أن يكون نصاً',
  'number': 'يجب أن يكون رقماً',
  'boolean': 'يجب أن يكون نعم أو لا',
  'enum': 'القيمة المختارة غير صالحة',
  'minLength': 'يجب أن يحتوي على {{ min }} أحرف على الأقل',
  'maxLength': 'يجب ألا يتجاوز {{ max }} حرفاً',
  'regex': 'الصيغة غير صحيحة',
  'confirmed': 'التأكيد غير متطابق',
  'positive': 'يجب أن يكون رقماً موجباً',
  'date': 'يجب أن يكون تاريخاً صالحاً',
  'array': 'يجب أن يكون قائمة',
  'array.minLength': 'يجب اختيار عنصر واحد على الأقل',
  'unique': 'هذه القيمة مسجلة مسبقاً',
  'optional': '',

  // ── User / Auth fields ──────────────────────────────────────────────────────
  'fullName.string': 'الاسم يجب أن يكون نصاً',
  'phone.required': 'رقم الهاتف مطلوب',
  'phone.regex': 'رقم الهاتف يجب أن يكون مصرياً صالحاً (مثال: 01012345678)',
  'phone.unique': 'رقم الهاتف مسجل مسبقاً',
  'password.required': 'كلمة المرور مطلوبة',
  'password.minLength': 'كلمة المرور يجب أن تكون {{ min }} أحرف على الأقل',
  'password.maxLength': 'كلمة المرور يجب ألا تتجاوز {{ max }} حرفاً',
  'passwordConfirmation.confirmed': 'تأكيد كلمة المرور غير متطابق',

  // ── Booking fields ──────────────────────────────────────────────────────────
  'date.required': 'تاريخ الحجز مطلوب',
  'date.date': 'صيغة التاريخ غير صالحة (YYYY-MM-DD)',
  'time.required': 'وقت الحجز مطلوب',
  'time.regex': 'وقت الحجز يجب أن يكون بصيغة HH:MM',
  'services.required': 'يجب اختيار خدمة واحدة على الأقل',
  'services.minLength': 'يجب اختيار خدمة واحدة على الأقل',
  'services.*.name.required': 'اسم الخدمة مطلوب',
  'services.*.price.required': 'سعر الخدمة مطلوب',
  'services.*.price.positive': 'سعر الخدمة يجب أن يكون موجباً',
  'status.required': 'حالة الحجز مطلوبة',
  'status.enum': 'حالة الحجز غير صالحة',

  // ── Package fields ──────────────────────────────────────────────────────────
  'name.required': 'اسم الباقة مطلوب',
  'name.minLength': 'اسم الباقة يجب أن يحتوي على حرف واحد على الأقل',
  'name.maxLength': 'اسم الباقة يجب ألا يتجاوز {{ max }} حرفاً',
  'description.required': 'وصف الباقة مطلوب',
  'description.minLength': 'وصف الباقة يجب أن يحتوي على حرف واحد على الأقل',
  'description.maxLength': 'وصف الباقة يجب ألا يتجاوز {{ max }} حرفاً',
  'price.required': 'سعر الباقة مطلوب',
  'price.positive': 'سعر الباقة يجب أن يكون موجباً',
} as const

// ─── Domain / business-logic error messages ─────────────────────────────────────

export const domainMessages = {
  // Auth
  'auth.invalid_credentials': 'رقم الهاتف أو كلمة المرور غير صحيحة',
  'auth.unauthenticated': 'يجب تسجيل الدخول',
  'auth.forbidden': 'ليس لديك صلاحية للوصول',

  // Booking
  'booking.past_slot': 'لا يمكن حجز موعد في الماضي',
  'booking.slot_full': 'هذا الموعد ممتلئ، يرجى اختيار وقت آخر',
  'booking.move_to_past': 'لا يمكن نقل الحجز إلى وقت في الماضي',
  'booking.modifications_disabled': 'تعديل الحجوزات معطّل حالياً',
  'booking.not_modifiable': 'لا يمكن تعديل هذا الحجز',
  'booking.cutoff_passed': 'لا يمكن تعديل الحجز قبل أقل من {{ hours }} ساعة من الموعد',
  'booking.invalid_status_transition': 'لا يمكن إرجاع حجز مكتمل أو متغيّب إلى حالة معلّق',

  // Package
  'package.not_found': 'الباقة غير موجودة',
} as const

// ─── Flash (success) messages used in controllers ───────────────────────────────

export const flashMessages = {
  'booking.created': 'تم إنشاء الحجز بنجاح',
  'booking.updated': 'تم تحديث الحجز بنجاح',
  'booking.cancelled': 'تم إلغاء الحجز بنجاح',
  'booking.status_updated': 'تم تحديث حالة الحجز',
  'booking.force_created': 'تم إنشاء الحجز (تجاوز السعة) بنجاح',

  'package.created': 'تم إنشاء الباقة بنجاح',
  'package.updated': 'تم تحديث الباقة بنجاح',
  'package.deleted': 'تم حذف الباقة بنجاح',
} as const

// Helper: replace simple {{ key }} tokens in a message template.
export function t(template: string, vars: Record<string, string | number> = {}): string {
  let result = template
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g'), String(value))
  }
  return result
}
