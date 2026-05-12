import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'apprecier'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('Id_Ouvrage')
        .unsigned()
        .references('id')
        .inTable('ouvrages')
        .onDelete('CASCADE')
        .notNullable()

      table
        .integer('Id_Utilisateur')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()

      // The Rating value
      table.integer('note').notNullable()

      /**
       * Optional: Prevent a user from rating the same book twice
       * (Already handled by .sync() in your controller, but good for DB integrity)
       */
      table.unique(['Id_Ouvrage', 'Id_Utilisateur'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
