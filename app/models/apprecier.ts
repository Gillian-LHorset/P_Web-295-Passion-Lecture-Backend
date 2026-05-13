import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Ouvrage from '#models/ouvrage'
import User from '#models/user'

export default class Apprecier extends BaseModel {
  public static table = 'apprecier'

  @column({ isPrimary: true, columnName: 'id' })
  declare id: number

  @column()
  declare note: number

  @column({ columnName: 'Id_Ouvrage' })
  declare idOuvrage: number

  @column({ columnName: 'Id_Utilisateur' })
  declare idUtilisateur: number

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  declare updatedAt: DateTime

  @belongsTo(() => Ouvrage, { foreignKey: 'idOuvrage' })
  declare ouvrage: BelongsTo<typeof Ouvrage>

  @belongsTo(() => User, { foreignKey: 'idUtilisateur' })
  declare utilisateur: BelongsTo<typeof User>
}
