import Ouvrage from '#models/ouvrage'
import type { HttpContext } from '@adonisjs/core/http'
import { createBookValidator, updateBookValidator } from '#validators/book'
import { ValidationException } from '#exceptions/api_exception'
import Categorie from '#models/categorie'

export default class BooksController {
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
      const { titre } = request.qs()

      let books
      if (titre) {
        books = await Ouvrage.query().where('titre', 'LIKE', `%${titre}%`)
      } else {
        books = await Ouvrage.all()
      }

      return response.ok(this.formatSuccessResponse(books, 200, 'Livres récupérés avec succès'))
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
          this.formatErrorResponse(400, "L'ID du livre est requis", 'E_VALIDATION_ERROR', {
            id: ["L'ID du livre est requis"],
          })
        )
      }

      const book = await Ouvrage.find(params.id)

      if (!book) {
        return response.notFound(this.formatErrorResponse(404, 'Livre non trouvé', 'E_NOT_FOUND'))
      }

      return response.ok(this.formatSuccessResponse(book, 200, 'Livre récupéré avec succès'))
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
  async getByCategory({ params, response }: HttpContext) {
    try {
      const category = await Categorie.query()
        .where('id', params.id)
        .preload('ouvrages')
        .firstOrFail()
      return response.ok(category)
    }
    catch (error){
      return response.internalServerError(this.formatErrorResponse(500, 'Erreur interne du serveur', 'E_INTERNAL_SERVER_ERROR', error instanceof Error ? error.message : 'Erreur inconnue'))  
    }
  }
  async getFiveLastBooks({ response }: HttpContext) {
    try {
      const lastBooks = await Ouvrage.query().limit(5).orderBy('created_at', 'desc').preload('user').preload('categorie').preload('auteur')
      return response.ok(lastBooks)
    }
    catch (error) {
      return response.internalServerError(this.formatErrorResponse(500, 'Erreur interne du serveur', 'E_INTERNAL_SERVER_ERROR', error instanceof Error ? error.message : 'Erreur inconnue'))  
    }
  }

  async store({ request, response }: HttpContext) {
    try {
      const {
        titre,
        anneeEdition,
        imageUrl,
        nombrePages,
        extrait,
        resume,
        nomEditeur,
        idUtilisateur,
        idCategorie,
        idAuteur,
      } = await request.validateUsing(createBookValidator)

      const bookData = {
        titre,
        anneeEdition,
        ...(imageUrl !== undefined && { imageUrl }),
        nombrePages,
        extrait,
        resume,
        nomEditeur,
        idUtilisateur,
        idCategorie,
        idAuteur,
      }

      const book = await Ouvrage.create(bookData)
      try {
        return response.created(this.formatSuccessResponse(book, 201, 'Livre créé avec succès'))
      } catch (dbError) {
        if (dbError instanceof Error && dbError.message.includes('unique')) {
          return response.badRequest(
            this.formatErrorResponse(400, 'Le livre existe déjà', 'E_BOOK_ALREADY_EXISTS')
          )
        }
        throw dbError
      }
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

  async update({ params, request, response, auth }: HttpContext) {
    try {
      if (!params.id) {
        return response.badRequest(
          this.formatErrorResponse(400, "L'ID du livre est requis", 'E_VALIDATION_ERROR', {
            id: ["L'ID du livre est requis"],
          })
        )
      }

      const book = await Ouvrage.find(params.id)

      if (!auth.user?.isAdmin && book?.idUtilisateur != auth.user?.id) {
        return response.badRequest(
          this.formatErrorResponse(403, 'Accès non autorisé', 'E_FORBIDDEN', {
            id: ["Vous n'êtes pas autorisé à accéder à cette ressource"],
          })
        )
      }

      const {
        titre,
        anneeEdition,
        imageUrl,
        nombrePages,
        extrait,
        resume,
        nomEditeur,
        idUtilisateur,
        idCategorie,
        idAuteur,
      } = await request.validateUsing(updateBookValidator)

      if (!book) {
        return response.notFound(this.formatErrorResponse(404, 'Livre non trouvé', 'E_NOT_FOUND'))
      }

      book.merge({
        titre,
        anneeEdition,
        imageUrl,
        nombrePages,
        extrait,
        resume,
        nomEditeur,
        idUtilisateur,
        idCategorie,
        idAuteur,
      })

      await book.save()

      return response.ok(this.formatSuccessResponse(book, 200, 'Livre mis à jour avec succès'))
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

  async updatePartial({ request, params, response, auth }: HttpContext) {
    try {
      if (!params.id) {
        return response.badRequest(
          this.formatErrorResponse(400, "L'ID du livre est requis", 'E_VALIDATION_ERROR', {
            id: ["L'ID du livre est requis"],
          })
        )
      }

      const book = await Ouvrage.find(params.id)

      if (!book) {
        return response.notFound(this.formatErrorResponse(404, 'Livre non trouvé', 'E_NOT_FOUND'))
      }

      if (!auth.user?.isAdmin && book?.idUtilisateur != auth.user?.id) {
        return response.badRequest(
          this.formatErrorResponse(403, 'Accès non autorisé', 'E_FORBIDDEN', {
            id: ["Vous n'êtes pas autorisé à accéder à cette ressource"],
          })
        )
      }

      const {
        titre,
        anneeEdition,
        imageUrl,
        nombrePages,
        extrait,
        resume,
        nomEditeur,
        idUtilisateur,
        idCategorie,
        idAuteur,
      } = await request.body()

      const updateData = {
        ...(titre !== undefined && { titre }),
        ...(anneeEdition !== undefined && { anneeEdition }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(nombrePages !== undefined && { nombrePages }),
        ...(extrait !== undefined && { extrait }),
        ...(resume !== undefined && { resume }),
        ...(idUtilisateur !== undefined && { idUtilisateur }),
        ...(idCategorie !== undefined && { idCategorie }),
        ...(nomEditeur !== undefined && { nomEditeur }),
        ...(idAuteur !== undefined && { idAuteur }),
      }

      book.merge(updateData)
      await book.save()

      return response.ok(this.formatSuccessResponse(book, 200, 'Livre mis à jour avec succès'))
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

  async destroy({ params, response, auth }: HttpContext) {
    try {
      if (!params.id) {
        return response.badRequest(
          this.formatErrorResponse(400, "L'ID du livre est requis", 'E_VALIDATION_ERROR', {
            id: ["L'ID du livre est requis"],
          })
        )
      }

      const book = await Ouvrage.find(params.id)

      if (!auth.user?.isAdmin && book?.idUtilisateur != auth.user?.id) {
        return response.badRequest(
          this.formatErrorResponse(403, 'Accès non autorisé', 'E_FORBIDDEN', {
            id: ["Vous n'êtes pas autorisé à accéder à cette ressource"],
          })
        )
      }

      if (!book) {
        return response.notFound(this.formatErrorResponse(404, 'Livre non trouvé', 'E_NOT_FOUND'))
      }

      await book.delete()

      return response.ok(
        this.formatSuccessResponse({ deleted: true }, 200, 'Livre supprimé avec succès')
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
