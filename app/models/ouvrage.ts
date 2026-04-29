import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Utilisateur from '#models/user'
import Categorie from '#models/categorie'
import Editeur from '#models/editeur'
import Auteur from '#models/auteur'

export default class Ouvrage extends BaseModel {
  @column({ isPrimary: true, columnName: 'id' })
  declare id: number

  @column()
  declare extrait: string

  @column()
  declare resume: string

  @column({ columnName: 'annee_edition' })
  declare anneeEdition: number

  @column({ columnName: 'image_url' })
  declare imageUrl: string | null

  @column({ columnName: 'nombre_pages' })
  declare nombrePages: number

  @column()
  declare titre: string

  @column({ columnName: 'Id_Utilisateur' })
  declare idUtilisateur: number

  @column({ columnName: 'Id_categorie' })
  declare idCategorie: number

  @column({ columnName: 'Id_editeur' })
  declare idEditeur: number

  @column({ columnName: 'Id_auteur' })
  declare idAuteur: number

  @belongsTo(() => Utilisateur, { foreignKey: 'idUtilisateur' })
  declare user: BelongsTo<typeof Utilisateur>

  @belongsTo(() => Categorie, { foreignKey: 'idCategorie' })
  declare categorie: BelongsTo<typeof Categorie>

  @belongsTo(() => Editeur, { foreignKey: 'idEditeur' })
  declare editeur: BelongsTo<typeof Editeur>

  @belongsTo(() => Auteur, { foreignKey: 'idAuteur' })
  declare auteur: BelongsTo<typeof Auteur>

  @manyToMany(() => Utilisateur, {
    pivotTable: 'commenter',
    pivotForeignKey: 'Id_Ouvrage',
    pivotRelatedForeignKey: 'Id_Utilisateur',
    pivotColumns: ['contenu'],
  })
  declare commenters: ManyToMany<typeof Utilisateur>

  @manyToMany(() => Utilisateur, {
    pivotTable: 'apprecier',
    pivotForeignKey: 'Id_Ouvrage',
    pivotRelatedForeignKey: 'Id_Utilisateur',
    pivotColumns: ['note'],
  })
  declare likers: ManyToMany<typeof Utilisateur>
}
