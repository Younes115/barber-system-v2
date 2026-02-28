import Package from '#models/package'

interface CreatePackagePayload {
  name: string
  description: string
  price: number
}

interface UpdatePackagePayload {
  name?: string
  description?: string
  price?: number
}

/**
 * PackageService — all service-package business logic lives here.
 * Controllers only validate requests and delegate to this service.
 */
export default class PackageService {
  /**
   * Returns all packages for public listing.
   * Ordered by id ascending so the catalog is stable.
   */
  async listPublicPackages(): Promise<Package[]> {
    return Package.query().orderBy('id', 'asc')
  }

  /**
   * Returns all packages for admin management view.
   * Ordered by most-recently created first.
   */
  async listAdminPackages(): Promise<Package[]> {
    return Package.query().orderBy('created_at', 'desc')
  }

  /**
   * Finds a package by id or throws a 404 ModelNotFoundException.
   * The global exception handler converts this into the appropriate HTTP response.
   */
  async getPackageOrFail(id: number): Promise<Package> {
    return Package.findOrFail(id)
  }

  /**
   * Creates a new service package.
   */
  async createPackage(payload: CreatePackagePayload): Promise<Package> {
    return Package.create({
      name: payload.name,
      description: payload.description,
      price: payload.price,
    })
  }

  /**
   * Updates an existing package with the given partial or full payload.
   */
  async updatePackage(id: number, payload: UpdatePackagePayload): Promise<Package> {
    const pkg = await this.getPackageOrFail(id)
    pkg.merge(payload)
    await pkg.save()
    return pkg
  }

  /**
   * Deletes a package.
   * In Phase 5+, add a guard here: if any active bookings reference this package,
   * throw a domain error instead of deleting.
   */
  async deletePackage(id: number): Promise<void> {
    const pkg = await this.getPackageOrFail(id)
    await pkg.delete()
  }
}
