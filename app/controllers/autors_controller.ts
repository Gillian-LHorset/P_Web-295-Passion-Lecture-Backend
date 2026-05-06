import { ValidationException } from '#exceptions/api_exception'
import Auteur from '#models/auteur'
import { createAuteurValidator, updateAuteurValidator } from '#validators/auteur'
import type { HttpContext } from '@adonisjs/core/http'

export default class AutorsController {
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

      let authors
      if (nom) {
        authors = await Auteur.query().where('nom', 'LIKE', `%${nom}%`)
      } else {
        authors = await Auteur.all()
      }

      return response.ok(this.formatSuccessResponse(authors, 200, 'Auteurs récupérés avec succès'))
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
          this.formatErrorResponse(400, "L'ID de l'auteur est requis", 'E_VALIDATION_ERROR', {
            id: ["L'ID de l'auteur est requis"],
          })
        )
      }

      const author = await Auteur.find(params.id)

      if (!author) {
        return response.notFound(this.formatErrorResponse(404, 'Auteur non trouvé', 'E_NOT_FOUND'))
      }

      return response.ok(this.formatSuccessResponse(author, 200, 'Auteur récupéré avec succès'))
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

  async store({ request, response }: HttpContext) {
    try {
      const { nom, prenom } = await request.validateUsing(createAuteurValidator)

      const newAutor = await Auteur.create({ nom, prenom })

      return response.created(this.formatSuccessResponse(newAutor, 201, 'Auteur créé avec succès'))
    } catch (error) {
      if (error instanceof ValidationException) {
        return response.unprocessableEntity(
          this.formatErrorResponse(422, 'Validation échouée', 'E_VALIDATION_ERROR', error.errors)
        )
      }

      if (error instanceof Error && error.message.includes('unique')) {
        return response.badRequest(
          this.formatErrorResponse(400, "L'auteur existe déjà", 'E_AUTHOR_ALREADY_EXISTS')
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

  async update({ request, params, response }: HttpContext) {
    try {
      if (!params.id) {
        return response.badRequest(
          this.formatErrorResponse(400, "L'ID de l'auteur est requis", 'E_VALIDATION_ERROR', {
            id: ["L'ID de l'auteur est requis"],
          })
        )
      }

      const { nom, prenom } = await request.validateUsing(updateAuteurValidator)

      const author = await Auteur.find(params.id)

      if (!author) {
        return response.notFound(this.formatErrorResponse(404, 'Auteur non trouvé', 'E_NOT_FOUND'))
      }

      author.merge({ nom, prenom })
      await author.save()

      return response.ok(this.formatSuccessResponse(author, 200, 'Auteur mis à jour avec succès'))
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

  async updatePartial({ request, params, response }: HttpContext) {
    try {
      if (!params.id) {
        return response.badRequest(
          this.formatErrorResponse(400, "L'ID de l'auteur est requis", 'E_VALIDATION_ERROR', {
            id: ["L'ID de l'auteur est requis"],
          })
        )
      }

      const author = await Auteur.find(params.id)

      if (!author) {
        return response.notFound(this.formatErrorResponse(404, 'Auteur non trouvé', 'E_NOT_FOUND'))
      }

      const { nom, prenom } = await request.body()

      const updateData = {
        ...(nom !== undefined && { nom }),
        ...(prenom !== undefined && { prenom }),
      }

      author.merge(updateData)
      await author.save()

      return response.ok(this.formatSuccessResponse(author, 200, 'Auteur mis à jour avec succès'))
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

  async destroy({ params, response }: HttpContext) {
    try {
      if (!params.id) {
        return response.badRequest(
          this.formatErrorResponse(400, "L'ID de l'auteur est requis", 'E_VALIDATION_ERROR', {
            id: ["L'ID de l'auteur est requis"],
          })
        )
      }

      const author = await Auteur.find(params.id)

      if (!author) {
        return response.notFound(this.formatErrorResponse(404, 'Auteur non trouvé', 'E_NOT_FOUND'))
      }

      await author.delete()

      return response.ok(
        this.formatSuccessResponse({ deleted: true }, 200, 'Auteur supprimé avec succès')
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
