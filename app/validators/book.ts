import vine from '@vinejs/vine'

const createBookValidator = vine.compile(
  vine.object({
    titre: vine.string().trim().minLength(1).maxLength(255),
    anneeEdition: vine.number().min(1000).max(new Date().getFullYear()),
    noteMoyenne: vine.number().min(0).max(5),
    imageUrl: vine.string().trim().maxLength(255).optional(),
    nombrePages: vine.number().min(1),
    extrait: vine.string().trim(),
    resume: vine.string().trim(),
    categorieNom: vine.string().trim(),
    idUtilisateur: vine.number().min(1),
    idCategorie: vine.number().min(1),
    idEditeur: vine.number().min(1),
    idAuteur: vine.number().min(1),
  })
)

const updateBookValidator = vine.compile(
  vine.object({
    titre: vine.string().trim().minLength(1).maxLength(255).optional(),
    anneeEdition: vine.number().min(1000).max(new Date().getFullYear()).optional(),
    noteMoyenne: vine.number().min(0).max(5).optional(),
    imageUrl: vine.string().trim().maxLength(255).optional(),
    nombrePages: vine.number().min(1).optional(),
    extrait: vine.string().trim().optional(),
    resume: vine.string().trim().optional(),
    categorieNom: vine.string().trim().optional(),
    idCategorie: vine.number().min(1).optional(),
    idEditeur: vine.number().min(1).optional(),
    idAuteur: vine.number().min(1).optional(),
  })
)

export { createBookValidator, updateBookValidator }
