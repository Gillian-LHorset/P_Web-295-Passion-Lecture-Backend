import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Ouvrage from '#models/ouvrage'
import User from '#models/user'
import Categorie from '#models/categorie'
import Auteur from '#models/auteur'
import Editeur from '#models/editeur'

export default class extends BaseSeeder {
  async run() {
    const users = await User.all()
    const categories = await Categorie.all()
    const auteurs = await Auteur.all()
    const editeurs = await Editeur.all()

    const count = await Ouvrage.query()
      .count('* as total')
      .then((res) => res[0].$extras.total)
    if (count === 0) {
      await Ouvrage.createMany([
        {
          titre: 'Dune',
          anneeEdition: 1965,
          imageUrl: 'https://example.com/dune.jpg',
          nombrePages: 600,
          idUtilisateur: users[0].id,
          idCategorie: categories[0].id,
          idAuteur: auteurs[0].id,
          idEditeur: editeurs[0].id,
          extrait: 'Le voyage commence...',
          resume: "Un chef-d'oeuvre de la SF.",
        },
        {
          titre: "L'Étranger",
          anneeEdition: 1942,
          imageUrl: 'https://example.com/etranger.jpg',
          nombrePages: 160,
          idUtilisateur: users[1].id,
          idCategorie: categories[1].id,
          idAuteur: auteurs[1].id,
          idEditeur: editeurs[1].id,
          extrait: "Aujourd'hui, maman est morte.",
          resume: "Une exploration de l'absurde.",
        },
      ])
    }
  }
}
