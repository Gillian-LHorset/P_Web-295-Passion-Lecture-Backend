import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Ouvrage from '#models/ouvrage'

export default class Auteur extends BaseModel {
  @column({ isPrimary: true, columnName: 'Id_auteur' })
  declare id: number

  @column()
  declare nom: string | null

  @column()
  declare prenom: string | null

  @hasMany(() => Ouvrage, { foreignKey: 'idAuteur' })
  declare ouvrages: HasMany<typeof Ouvrage>
}
