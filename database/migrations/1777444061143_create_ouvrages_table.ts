import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ouvrages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('titre', 255).notNullable
      table.integer('annee_edition')
      table.float('note_moyenne', 2, 1)
      table.string('image_url', 255)
      table.string('categorieNom', 255)
      table.integer('nombre_pages')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
