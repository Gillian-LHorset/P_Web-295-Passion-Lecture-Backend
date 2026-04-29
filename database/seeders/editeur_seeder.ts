import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Editeur from '#models/editeur'
export default class extends BaseSeeder {
  async run() {
    const count = await Editeur.query()
      .count('* as total')
      .then((res) => res[0].$extras.total)
    if (count === 0) {
      await Editeur.createMany([{ nom: 'Pocket' }, { nom: 'Gallimard' }, { nom: 'Antoine Mveng' }])
    }
  }
}
