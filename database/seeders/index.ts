import { BaseSeeder } from '@adonisjs/lucid/seeders'
import UserSeeder from './user_seeder.js'
import CategorieSeeder from './categorie_seeder.js'
import AuteurSeeder from './auteur_seeder.js'
import EditeurSeeder from './editeur_seeder.js'
import OuvrageSeeder from './ouvrage_seeder.js'

export default class IndexSeeder extends BaseSeeder {
  async run() {
    // Run seeders in order of dependencies
    const UserSeederInstance = new UserSeeder(this.client)
    await UserSeederInstance.run()

    const CategorieSeederInstance = new CategorieSeeder(this.client)
    await CategorieSeederInstance.run()

    const AuteurSeederInstance = new AuteurSeeder(this.client)
    await AuteurSeederInstance.run()

    const EditeurSeederInstance = new EditeurSeeder(this.client)
    await EditeurSeederInstance.run()

    const OuvrageSeederInstance = new OuvrageSeeder(this.client)
    await OuvrageSeederInstance.run()
  }
}
