import Auteur from '#models/auteur'
import { createAuteurValidator, updateAuteurValidator } from '#validators/auteur'
import type { HttpContext } from '@adonisjs/core/http'

export default class AutorsController {
  /**
   * Display a list of resource
   */
  async getAllAutors({}: HttpContext) {
    return Auteur.query()
  }

  async getAutor({ params }: HttpContext) {
    return Auteur.query().where('id', params.id)
  }

  /**
   * Display form to create a new record
   */
  async createAutor({ request }: HttpContext) {
    const { nom, prenom } = await request.validateUsing(createAuteurValidator)

    const newAutor = { nom, prenom }

    Auteur.create(newAutor)
  }

  /**
   * Handle form submission for the create action
   */
  async putAutor({ request }: HttpContext) {
    const { nom, prenom } = await request.validateUsing(createAuteurValidator)

    const newAutor = await Auteur.findOrFail(request.id)

    newAutor.merge({
      nom,
      prenom,
    })

    newAutor.save()
  }

  async patchAutor({ request, params }: HttpContext) {
    const id = params.id
    const { nom, prenom } = await request.body()

    const autor = await Auteur.findOrFail(id)

    // only value changed by the user
    const updatedData = {
      ...(nom !== undefined && { nom }),
      ...(prenom !== undefined && { prenom }),
    }

    autor.merge(updatedData)
    await autor.save()
  }

  /**
   * Delete record
   */
  async deleteAutor({ params }: HttpContext) {
    Auteur.query().delete().where('id', params.id)
  }
}
