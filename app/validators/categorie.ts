import vine from '@vinejs/vine'

const createCategorieValidator = vine.compile(
  vine.object({
    nom: vine.string().trim().minLength(1).maxLength(255),
  })
)
const updateCategorieValidator = vine.compile(
  vine.object({
    nom: vine.string().trim().minLength(1).maxLength(255).optional(),
  })
)
export { createCategorieValidator, updateCategorieValidator }
