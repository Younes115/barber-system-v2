import AdminDashboardService from '#services/admin_dashboard_service'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * AdminController — admin-only dashboard endpoint.
 * Delegates all metric computation to AdminDashboardService.
 */
export default class AdminController {
  private dashboardService = new AdminDashboardService()

  /**
   * GET /admin/dashboard — high-level metrics for the admin panel.
   */
  async dashboard(ctx: HttpContext) {
    const metrics = await this.dashboardService.getMetrics()
    return ctx.inertia.render('admin/dashboard' as any, { metrics })
  }
}
