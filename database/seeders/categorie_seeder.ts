import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Categorie from '#models/categorie'
export default class extends BaseSeeder {
  async run() {
    const count = await Categorie.query()
      .count('* as total')
      .then((res) => res[0].$extras.total)
    if (count === 0) {
      await Categorie.createMany([
        { nom: 'Science-Fiction' },
        { nom: 'Philosophie' },
        { nom: 'Développement Personnel' },
      ])
    }
  }
}
