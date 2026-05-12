import Ouvrage from '#models/ouvrage'
import type { HttpContext } from '@adonisjs/core/http'
import { createRatingValidator } from '#validators/rating'
import { ValidationException } from '#exceptions/api_exception'

export default class RatingsController {
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

  async store({ auth, params, request, response }: HttpContext) {
    try {
      if (!auth.user) {
        return response.unauthorized(
          this.formatErrorResponse(401, 'Authentification requise', 'E_UNAUTHORIZED')
        )
      }

      if (!params.bookId) {
        return response.badRequest(
          this.formatErrorResponse(400, "L'ID du livre est requis", 'E_VALIDATION_ERROR', {
            bookId: ["L'ID du livre est requis"],
          })
        )
      }

      const book = await Ouvrage.find(params.bookId)
      if (!book) {
        return response.notFound(this.formatErrorResponse(404, 'Livre non trouvé', 'E_NOT_FOUND'))
      }

      const { note } = await request.validateUsing(createRatingValidator)

      await book.related('likers').sync({
        [auth.user.id]: { note },
      })

      return response.created(
        this.formatSuccessResponse(
          { userId: auth.user.id, note },
          201,
          'Évaluation ajoutée avec succès'
        )
      )
    } catch (error) {
      if (error instanceof ValidationException) {
        return response.unprocessableEntity(
          this.formatErrorResponse(422, 'Validation échouée', 'E_VALIDATION_ERROR', error.errors)
        )
      }

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

  async getRatings({ params, response }: HttpContext) {
    try {
      if (!params.bookId) {
        return response.badRequest(
          this.formatErrorResponse(400, "L'ID du livre est requis", 'E_VALIDATION_ERROR', {
            bookId: ["L'ID du livre est requis"],
          })
        )
      }

      const book = await Ouvrage.find(params.bookId)
      if (!book) {
        return response.notFound(this.formatErrorResponse(404, 'Livre non trouvé', 'E_NOT_FOUND'))
      }

      const ratings = await book.related('likers').query()

      const formattedRatings = ratings.map((user) => ({
        id: user.id,
        pseudo: user.pseudo,
        note: user.$extras.pivot_note,
      }))

      return response.ok(
        this.formatSuccessResponse(formattedRatings, 200, 'Évaluations récupérées avec succès')
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

  async destroy({ auth, params, response }: HttpContext) {
    try {
      if (!auth.user) {
        return response.unauthorized(
          this.formatErrorResponse(401, 'Authentification requise', 'E_UNAUTHORIZED')
        )
      }

      if (!params.bookId) {
        return response.badRequest(
          this.formatErrorResponse(400, "L'ID du livre est requis", 'E_VALIDATION_ERROR', {
            bookId: ["L'ID du livre est requis"],
          })
        )
      }

      const book = await Ouvrage.find(params.bookId)
      if (!book) {
        return response.notFound(this.formatErrorResponse(404, 'Livre non trouvé', 'E_NOT_FOUND'))
      }

      await book.related('likers').detach([auth.user.id])

      return response.ok(
        this.formatSuccessResponse({ deleted: true }, 200, 'Évaluation supprimée avec succès')
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
