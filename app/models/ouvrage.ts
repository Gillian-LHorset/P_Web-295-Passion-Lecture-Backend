import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Ouvrage extends BaseModel {
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare titre: string
  @column()
  declare anneePublication: number
  @column()
  declare extrait: string
  @column()
  declare note_moyenne: number
  @column()
  declare commentaires: string
  @column()
  declare image_url: string
  @column()
  declare nombre_pages: number

  @column()
  declare resume: string
  @column()
  declare auteurId: number
  @column()
  declare editeurId: number
  @column()
  declare categorieId: number
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
