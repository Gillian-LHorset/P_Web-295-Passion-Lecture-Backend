import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Ouvrage from '#models/ouvrage'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare pseudo: string | null

  @column({ columnName: 'nombre_ouvrages_proposes' })
  declare nombreOuvragesProposes: number

  @column({ columnName: 'nombre_commentaires' })
  declare nombreCommentaires: number

  @column({ columnName: 'nombre_appreciations' })
  declare nombreAppreciations: number
  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Ouvrage, { foreignKey: 'idUtilisateur' })
  declare ouvrages: HasMany<typeof Ouvrage>
  static accessTokens = DbAccessTokensProvider.forModel(User)
}
