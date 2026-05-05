import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ouvrages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('titre', 255).notNullable()
      table.integer('annee_edition')
      table.string('image_url', 255)
      table.integer('nombre_pages')
      table.text('extrait')
      table.text('resume')
      table.string('nom_editeur', 255)
      table.integer('Id_Utilisateur').unsigned()
      table.integer('Id_categorie').unsigned()
      table.integer('Id_auteur').unsigned()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
