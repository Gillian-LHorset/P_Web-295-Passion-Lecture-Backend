import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Ouvrage from '#models/ouvrage'

export default class Categorie extends BaseModel {
  @column({ isPrimary: true, columnName: 'Id_categorie' })
  declare id: number

  @column()
  declare nom: string | null

  @hasMany(() => Ouvrage, { foreignKey: 'idCategorie' })
  declare ouvrages: HasMany<typeof Ouvrage>
}
