import vine from '@vinejs/vine'
const createEditeurValidator = vine.compile(
  vine.object({
    nom: vine.string().trim().minLength(1).maxLength(255),
  })
)
const updateEditeurValidator = vine.compile(
  vine.object({
    nom: vine.string().trim().minLength(1).maxLength(255).optional(),
  })
)
export { createEditeurValidator, updateEditeurValidator }
