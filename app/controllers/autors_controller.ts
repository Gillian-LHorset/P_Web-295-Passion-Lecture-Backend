import { NotFoundException } from '#exceptions/api_exception'
import Auteur from '#models/auteur'
import { createAuteurValidator, updateAuteurValidator } from '#validators/auteur'
import type { HttpContext } from '@adonisjs/core/http'

export default class AutorsController {
  /**
   * Display a list of resource
   */
  async index({ request }: HttpContext) {
    const { nom } = request.qs()

    if (nom) {
      return Auteur.query().where('nom', 'LIKE', `%${nom}%`)
    }

    return Auteur.all()
  }

  async show({ params }: HttpContext) {
    return Auteur.query().where('id', params.id)
  }

  /**
   * Display form to create a new record
   */
  async store({ request }: HttpContext) {
    const { nom, prenom } = await request.validateUsing(createAuteurValidator)

    const newAutor = { nom, prenom }

    Auteur.create(newAutor)
  }

  /**
   * Handle form submission for the create action
   */
  async update({ request }: HttpContext) {
    const { nom, prenom } = await request.validateUsing(createAuteurValidator)

    const newAutor = await Auteur.findOrFail(request.id)

    newAutor.merge({
      nom,
      prenom,
    })

    newAutor.save()
  }

  async updatePartial({ request, params }: HttpContext) {
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
  async destroy({ params }: HttpContext) {
    Auteur.query().delete().where('id', params.id)
  }
}
