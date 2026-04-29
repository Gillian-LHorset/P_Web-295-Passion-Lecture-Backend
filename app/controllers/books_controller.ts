import Ouvrage from '#models/ouvrage'
import type { HttpContext } from '@adonisjs/core/http'
import { createBookValidator, updateBookValidator } from '#validators/book'

export default class BooksController {
  /**
   * Display a list of resource
   */
  async getAllBooks({ response }: HttpContext) {
    return Ouvrage.query()
  }

  async getBook({ params }: HttpContext) {
    return Ouvrage.query().where('id', params.id)
  }

  /**
   * Display form to create a new record
   */
  async createBook({ request }: HttpContext) {
    const {
      titre,
      anneeEdition,
      imageUrl,
      nombrePages,
      extrait,
      resume,
      idUtilisateur,
      idCategorie,
      idEditeur,
      idAuteur,
    } = await request.validateUsing(createBookValidator)

    const bookData = {
      titre,
      anneeEdition,
      ...(imageUrl !== undefined && { imageUrl }), // add it only if the field in enter by the user
      nombrePages,
      extrait,
      resume,
      idUtilisateur,
      idCategorie,
      idEditeur,
      idAuteur,
    }

    Ouvrage.create(bookData)
  }

  /**
   * Handle form submission for the edit action
   */
  async putBook({ params, request }: HttpContext) {
    const id = params.id

    const {
      titre,
      anneeEdition,
      imageUrl,
      nombrePages,
      extrait,
      resume,
      idUtilisateur,
      idCategorie,
      idEditeur,
      idAuteur,
    } = await request.validateUsing(updateBookValidator)

    const book = await Ouvrage.findOrFail(id)

    book.merge({
      titre,
      anneeEdition,
      imageUrl,
      nombrePages,
      extrait,
      resume,
      idUtilisateur,
      idCategorie,
      idEditeur,
      idAuteur,
    })

    book.save()
  }

  async patchBook({ request, params, response }: HttpContext) {
    const id = params.id
    const {
      titre,
      anneeEdition,
      imageUrl,
      nombrePages,
      extrait,
      resume,
      idUtilisateur,
      idCategorie,
      idEditeur,
      idAuteur,
    } = await request.body()

    const book = await Ouvrage.findOrFail(id)

    // only value changed by the user
    const updateData = {
      ...(titre !== undefined && { titre }),
      ...(anneeEdition !== undefined && { anneeEdition }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(nombrePages !== undefined && { nombrePages }),
      ...(extrait !== undefined && { extrait }),
      ...(resume !== undefined && { resume }),
      ...(idUtilisateur !== undefined && { idUtilisateur }),
      ...(idCategorie !== undefined && { idCategorie }),
      ...(idEditeur !== undefined && { idEditeur }),
      ...(idAuteur !== undefined && { idAuteur }),
    }

    book.merge(updateData)
    await book.save()
  }

  /**
   * Delete record
   */
  async deleteBook({ params }: HttpContext) {
    Ouvrage.query().delete().where('id', params.id)
  }
}
