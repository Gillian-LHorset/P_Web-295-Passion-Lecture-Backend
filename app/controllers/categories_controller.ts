import type { HttpContext } from '@adonisjs/core/http'
import { NotFoundException, ValidationException } from '#exceptions/api_exception'
import Categorie from '#models/categorie'

export default class CategoriesController {
  async index({ request }: HttpContext) {
    const { nom } = request.qs()

    if (nom) {
      return Categorie.query().where('nom', 'LIKE', `%${nom}%`)
    }

    return Categorie.all()
  }
}
