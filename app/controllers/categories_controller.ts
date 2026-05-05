import type { HttpContext } from '@adonisjs/core/http'
import { NotFoundException, ValidationException } from '#exceptions/api_exception'
import Categorie from '#models/categorie'

export default class CategoriesController {
  async getCategorysByName({ request }: HttpContext) {
    const { nom } = request.qs()

    if (!nom) {
      throw new NotFoundException('Book')
    }

    const categorys = Categorie.query().where('nom', 'LIKE', `%${nom}%`)

    return categorys
  }

  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {}

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
