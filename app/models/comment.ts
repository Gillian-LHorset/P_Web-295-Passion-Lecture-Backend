import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Ouvrage from '#models/ouvrage'
import Utilisateur from '#models/user'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare contenu: string

  @column({ columnName: 'Id_Ouvrage' })
  declare idOuvrage: number

  @column({ columnName: 'Id_Utilisateur' })
  declare idUtilisateur: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Ouvrage, { foreignKey: 'idOuvrage' })
  declare ouvrage: BelongsTo<typeof Ouvrage>

  @belongsTo(() => Utilisateur, { foreignKey: 'idUtilisateur' })
  declare user: BelongsTo<typeof Utilisateur>
}
