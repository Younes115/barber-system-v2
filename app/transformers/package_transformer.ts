import type Package from '#models/package'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class PackageTransformer extends BaseTransformer<Package> {
    toObject() {
        return {
            ...this.pick(this.resource, ['id', 'name', 'description', 'duration', 'createdAt', 'updatedAt']),
            price: Number(this.resource.price),
            formattedPrice: this.resource.formattedPrice,
        }
    }
}
