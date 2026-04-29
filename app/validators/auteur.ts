import vine from '@vinejs/vine'

const createAuteurValidator = vine.compile(
  vine.object({
    nom: vine.string().trim().minLength(1).maxLength(255),
    prenom: vine.string().trim().minLength(1).maxLength(255),
  })
)
const updateAuteurValidator = vine.compile(
  vine.object({
    nom: vine.string().trim().minLength(1).maxLength(255).optional(),
    prenom: vine.string().trim().minLength(1).maxLength(255).optional(),
  })
)
export { createAuteurValidator, updateAuteurValidator }
