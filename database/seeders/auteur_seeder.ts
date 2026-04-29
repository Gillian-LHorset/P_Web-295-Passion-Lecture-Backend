import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Auteur from '#models/auteur'
export default class extends BaseSeeder {
  async run() {
    const count = await Auteur.query()
      .count('* as total')
      .then((res) => res[0].$extras.total)
    if (count === 0) {
      await Auteur.createMany([
        { nom: 'Herbert', prenom: 'Frank' },
        { nom: 'Camus', prenom: 'Albert' },
        { nom: 'Clear', prenom: 'James' },
      ])
    }
  }
}
