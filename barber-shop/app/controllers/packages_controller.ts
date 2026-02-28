import PackageService from '#services/package_service'
import { createPackageValidator, updatePackageValidator } from '#validators/package'
import type { HttpContext } from '@adonisjs/core/http'
import { flashMessages } from '#i18n/messages'

/**
 * PackagesController — thin HTTP/Inertia bridge.
 * No business logic here; all CRUD rules live in PackageService.
 */
export default class PackagesController {
  private packageService = new PackageService()

  // ─── Public ─────────────────────────────────────────────────────────────────

  /**
   * GET /packages — public list for all visitors.
   */
  async index({ inertia }: HttpContext) {
    const packages = await this.packageService.listPublicPackages()
    return inertia.render('packages/index' as any, { packages })
  }

  // ─── Admin ───────────────────────────────────────────────────────────────────

  /**
   * GET /admin/packages — admin list with management actions.
   */
  async adminIndex({ inertia }: HttpContext) {
    const packages = await this.packageService.listAdminPackages()
    return inertia.render('admin/packages/index' as any, { packages })
  }

  /**
   * GET /admin/packages/create — render create form.
   */
  async create({ inertia }: HttpContext) {
    return inertia.render('admin/packages/create' as any, {})
  }

  /**
   * POST /admin/packages — validate and persist a new package.
   */
  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createPackageValidator)
    await this.packageService.createPackage(payload)
    ctx.session.flash('success', flashMessages['package.created'])
    return ctx.response.redirect().toRoute('admin.packages.index')
  }

  /**
   * GET /admin/packages/:id/edit — render edit form.
   */
  async edit(ctx: HttpContext) {
    const pkg = await this.packageService.getPackageOrFail(Number(ctx.params.id))
    return ctx.inertia.render('admin/packages/edit' as any, { package: pkg.toJSON() })
  }

  /**
   * PUT /admin/packages/:id — validate and persist updates.
   */
  async update(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(updatePackageValidator)
    await this.packageService.updatePackage(Number(ctx.params.id), payload)
    ctx.session.flash('success', flashMessages['package.updated'])
    return ctx.response.redirect().toRoute('admin.packages.index')
  }

  /**
   * DELETE /admin/packages/:id — delete a package.
   */
  async destroy(ctx: HttpContext) {
    await this.packageService.deletePackage(Number(ctx.params.id))
    ctx.session.flash('success', flashMessages['package.deleted'])
    return ctx.response.redirect().toRoute('admin.packages.index')
  }
}
