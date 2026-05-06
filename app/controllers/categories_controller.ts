import type { HttpContext } from '@adonisjs/core/http'
import Categorie from '#models/categorie'

export default class CategoriesController {
  private formatErrorResponse(status: number, message: string, code: string, details?: any) {
    return {
      success: false,
      status,
      code,
      message,
      ...(details && { details }),
    }
  }

  private formatSuccessResponse(data: any, status: number = 200, message: string = 'Succès') {
    return {
      success: true,
      status,
      message,
      data,
    }
  }

  async index({ request, response }: HttpContext) {
    try {
      const { nom } = request.qs()

      let categories
      if (nom) {
        categories = await Categorie.query().where('nom', 'LIKE', `%${nom}%`)
      } else {
        categories = await Categorie.all()
      }

      return response.ok(
        this.formatSuccessResponse(categories, 200, 'Catégories récupérées avec succès')
      )
    } catch (error) {
      return response.internalServerError(
        this.formatErrorResponse(
          500,
          'Erreur interne du serveur',
          'E_INTERNAL_SERVER_ERROR',
          error instanceof Error ? error.message : 'Erreur inconnue'
        )
      )
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      if (!params.id) {
        return response.badRequest(
          this.formatErrorResponse(400, "L'ID de la catégorie est requis", 'E_VALIDATION_ERROR', {
            id: ["L'ID de la catégorie est requis"],
          })
        )
      }

      const category = await Categorie.find(params.id)

      if (!category) {
        return response.notFound(
          this.formatErrorResponse(404, 'Catégorie non trouvée', 'E_NOT_FOUND')
        )
      }

      return response.ok(
        this.formatSuccessResponse(category, 200, 'Catégorie récupérée avec succès')
      )
    } catch (error) {
      return response.internalServerError(
        this.formatErrorResponse(
          500,
          'Erreur interne du serveur',
          'E_INTERNAL_SERVER_ERROR',
          error instanceof Error ? error.message : 'Erreur inconnue'
        )
      )
    }
  }
}
