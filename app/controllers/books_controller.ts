import Ouvrage from '#models/ouvrage'
import type { HttpContext } from '@adonisjs/core/http'
import { createBookValidator } from '#validators/book'

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
      noteMoyenne,
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
      noteMoyenne,
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
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async deleteBook({ params }: HttpContext) {
    Ouvrage.query().delete().where('id', params.id)
  }
}
