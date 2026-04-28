import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'
import Ouvrage from './ouvrage.js'
export default class Note extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare valeur: number
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
  @belongsTo(() => User)
  user: any
  @belongsTo(() => Ouvrage)
  ouvrage: any
}
