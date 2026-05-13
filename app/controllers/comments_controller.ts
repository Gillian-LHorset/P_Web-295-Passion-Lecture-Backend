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

      const formattedComments = comments.map((user) => ({
        id: user.id,
        pseudo: user.pseudo,
        contenu: user.$extras.pivot_contenu,
        createdAt: user.$extras.pivot_created_at,
      }))

      return response.ok(
        this.formatSuccessResponse(formattedComments, 200, 'Commentaires récupérés avec succès')
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

      const { contenu } = await request.validateUsing(createCommentValidator)

      const commentaire = await book
        .related('commenters')
        .pivotQuery()
        .where('Id_Utilisateur', auth.user.id)
        .first()

      if (!auth.user?.isAdmin && commentaire?.idUtilisateur != auth.user?.id) {
        return response.badRequest(
          this.formatErrorResponse(403, 'Accès non autorisé', 'E_FORBIDDEN', {
            id: ["Vous n'êtes pas autorisé à accéder à cette ressource"],
          })
        )
      }

      const updated = (await book
        .related('commenters')
        .pivotQuery()
        .where('Id_Utilisateur', auth.user.id)
        .update({ contenu })) as any

      if (updated === 0 || (Array.isArray(updated) && updated.length === 0)) {
        return response.notFound(
          this.formatErrorResponse(
            404,
            'Commentaire non trouvé pour cet utilisateur',
            'E_NOT_FOUND'
          )
        )
      }

      return response.ok(
        this.formatSuccessResponse(
          { userId: auth.user.id, contenu },
          200,
          'Commentaire mis à jour avec succès'
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

      const commentaire = await book
        .related('commenters')
        .pivotQuery()
        .where('Id_Utilisateur', auth.user.id)
        .first()

      if (!auth.user?.isAdmin && commentaire?.idUtilisateur != auth.user?.id) {
        return response.badRequest(
          this.formatErrorResponse(403, 'Accès non autorisé', 'E_FORBIDDEN', {
            id: ["Vous n'êtes pas autorisé à accéder à cette ressource"],
          })
        )
      }

      await book.related('commenters').pivotQuery().where('Id_Utilisateur', auth.user.id).delete()

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
