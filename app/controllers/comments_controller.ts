import Ouvrage from '#models/ouvrage'
import type { HttpContext } from '@adonisjs/core/http'
import { createCommentValidator } from '#validators/comment'
import { ValidationException } from '#exceptions/api_exception'

export default class CommentsController {
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

      const { contenu } = await request.validateUsing(createCommentValidator)

      await book.related('commenters').attach({
        [auth.user.id]: { contenu },
      })

      return response.created(
        this.formatSuccessResponse(
          { userId: auth.user.id, contenu },
          201,
          'Commentaire ajouté avec succès'
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

  async getComments({ params, response }: HttpContext) {
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

      const comments = await book.related('commenters').query()

      return response.ok(
        this.formatSuccessResponse(comments, 200, 'Commentaires récupérés avec succès')
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

      await book.related('commenters').detach([auth.user.id])

      return response.ok(
        this.formatSuccessResponse({ deleted: true }, 200, 'Commentaire supprimé avec succès')
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
