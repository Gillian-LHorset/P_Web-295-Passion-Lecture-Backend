import Ouvrage from '#models/ouvrage'
import Apprecier from '#models/apprecier'
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

  private async getAverageRating(bookId: number): Promise<number> {
    const result = await Apprecier.query()
      .where('Id_Ouvrage', bookId)
      .avg('note as average')
      .first()

    const avg = result?.$extras.average
    return avg ? Number(parseFloat(avg).toFixed(1)) : 0
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
      }, false)

      const averageRating = await this.getAverageRating(book.id)

      return response.created(
        this.formatSuccessResponse(
          { userId: auth.user.id, note, averageRating },
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

  async update({ auth, params, request, response }: HttpContext) {
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

      const rating = await book
        .related('likers')
        .pivotQuery()
        .where('Id_Utilisateur', auth.user.id)
        .first()

      if (!auth.user?.isAdmin && rating?.Id_Utilisateur != auth.user?.id) {
        return response.badRequest(
          this.formatErrorResponse(403, 'Accès non autorisé', 'E_FORBIDDEN', {
            id: ["Vous n'êtes pas autorisé à accéder à cette ressource"],
          })
        )
      }

      const { note } = await request.validateUsing(createRatingValidator)

      const updated = (await book
        .related('likers')
        .pivotQuery()
        .where('Id_Utilisateur', auth.user.id)
        .update({ note })) as any

      if (updated === 0 || (Array.isArray(updated) && updated.length === 0)) {
        return response.notFound(
          this.formatErrorResponse(
            404,
            'Évaluation non trouvée pour cet utilisateur',
            'E_NOT_FOUND'
          )
        )
      }

      const averageRating = await this.getAverageRating(book.id)

      return response.ok(
        this.formatSuccessResponse(
          { userId: auth.user.id, note, averageRating },
          200,
          'Évaluation mise à jour avec succès'
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

      const rating = await book
        .related('likers')
        .pivotQuery()
        .where('Id_Utilisateur', auth.user.id)
        .first()

      if (!auth.user?.isAdmin && rating?.Id_Utilisateur != auth.user?.id) {
        return response.badRequest(
          this.formatErrorResponse(403, 'Accès non autorisé', 'E_FORBIDDEN', {
            id: ["Vous n'êtes pas autorisé à accéder à cette ressource"],
          })
        )
      }

      await book.related('likers').detach([auth.user.id])

      const averageRating = await this.getAverageRating(book.id)

      return response.ok(
        this.formatSuccessResponse({ deleted: true, averageRating }, 200, 'Évaluation supprimée avec succès')
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
