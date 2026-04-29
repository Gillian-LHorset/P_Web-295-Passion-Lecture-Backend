import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Ouvrage from '#models/ouvrage'

export default class Editeur extends BaseModel {
  @column({ isPrimary: true, columnName: 'id' })
  declare id: number

  @column()
  declare nom: string | null

  @hasMany(() => Ouvrage, { foreignKey: 'idEditeur' })
  declare ouvrages: HasMany<typeof Ouvrage>
}
