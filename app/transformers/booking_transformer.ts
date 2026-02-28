import type Booking from '#models/booking'
import { BaseTransformer } from '@adonisjs/core/transformers'
import UserTransformer from '#transformers/user_transformer'

export default class BookingTransformer extends BaseTransformer<Booking> {
    toObject() {
        return {
            ...this.pick(this.resource, [
                'id',
                'userId',
                'name',
                'phone',
                'date',
                'time',
                'servicesJson',
                'status',
                'overbooked',
                'createdAt',
            ]),
            isPast: this.resource.isPast,
            isEditable: this.resource.isEditable,
            user: UserTransformer.transform(this.whenLoaded(this.resource.user))
        }
    }
}
