import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'apprecier'

  async up() {
    const exists = await this.schema.hasTable(this.tableName)
    if (!exists) {
      this.schema.createTable(this.tableName, (table) => {
        table.increments('id').primary()
        table.integer('note').notNullable()
        table.integer('Id_Ouvrage').unsigned().notNullable()
        table.integer('Id_Utilisateur').unsigned().notNullable()
        table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
        table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

        table.foreign('Id_Ouvrage').references('id').inTable('ouvrages').onDelete('CASCADE')
        table.foreign('Id_Utilisateur').references('id').inTable('users').onDelete('CASCADE')
      })
    }
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}