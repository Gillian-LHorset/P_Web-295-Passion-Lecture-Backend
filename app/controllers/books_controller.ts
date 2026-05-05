import Ouvrage from '#models/ouvrage'
import type { HttpContext } from '@adonisjs/core/http'
import { createBookValidator, updateBookValidator } from '#validators/book'
import { NotFoundException, ValidationException } from '#exceptions/api_exception'

export default class BooksController {
  /**
   * Display a list of resources
   */
  async getAllBooks({ response }: HttpContext) {
    try {
      const books = await Ouvrage.query()
      return response.ok({
        success: true,
        data: books,
      })
    } catch (error) {
      throw error
    }
  }

  /**
   * Display a single resource by ID
   */
  async getBook({ params, response }: HttpContext) {
    try {
      if (!params.id) {
        throw new ValidationException('Book ID is required', { id: ['Book ID is required'] })
      }

      const book = await Ouvrage.find(params.id)

      if (!book) {
        throw new NotFoundException('Book')
      }

      return response.ok({
        success: true,
        data: book,
      })
    } catch (error) {
      throw error
    }
  }

  async getBooksByName({ request }: HttpContext) {
    const { titre } = request.qs()

    if (!titre) {
      throw new NotFoundException('Book')
    }

    const book = Ouvrage.query().where('titre', 'LIKE', `%${titre}%`)

    return book
  }

  /**
   * Create a new book
   */
  async createBook({ request, response }: HttpContext) {
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

      return response.created({
        success: true,
        message: 'Book created successfully',
        data: book,
      })
    } catch (error) {
      throw error
    }
  }

  /**
   * Update a book (full update)
   */
  async putBook({ params, request, response }: HttpContext) {
    try {
      if (!params.id) {
        throw new ValidationException('Book ID is required', { id: ['Book ID is required'] })
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

      const book = await Ouvrage.find(params.id)

      if (!book) {
        throw new NotFoundException('Book')
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

      return response.ok({
        success: true,
        message: 'Book updated successfully',
        data: book,
      })
    } catch (error) {
      throw error
    }
  }

  /**
   * Partial update a book
   */
  async patchBook({ request, params, response }: HttpContext) {
    try {
      if (!params.id) {
        throw new ValidationException('Book ID is required', { id: ['Book ID is required'] })
      }

      const book = await Ouvrage.find(params.id)

      if (!book) {
        throw new NotFoundException('Book')
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

      // only update values changed by the user
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

      return response.ok({
        success: true,
        message: 'Book updated successfully',
        data: book,
      })
    } catch (error) {
      throw error
    }
  }

  /**
   * Delete a book
   */
  async deleteBook({ params, response }: HttpContext) {
    try {
      if (!params.id) {
        throw new ValidationException('Book ID is required', { id: ['Book ID is required'] })
      }

      const book = await Ouvrage.find(params.id)

      if (!book) {
        throw new NotFoundException('Book')
      }

      await book.delete()

      return response.ok({
        success: true,
        message: 'Book deleted successfully',
      })
    } catch (error) {
      throw error
    }
  }
}
