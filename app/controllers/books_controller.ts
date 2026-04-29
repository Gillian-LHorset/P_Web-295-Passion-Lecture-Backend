import Ouvrage from '#models/ouvrage'
import type { HttpContext } from '@adonisjs/core/http'
import { postBookValidator } from '#validators/book'

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
    const { test } = await request.validateUsing(postBookValidator)
    return test
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
