import vine from '@vinejs/vine'
const createUserValidator = vine.compile(
  vine.object({
    pseudo: vine.string().trim().minLength(1).maxLength(255),
    password: vine.string().trim().minLength(6).maxLength(255),
    isAdmin: vine.boolean().optional(),
    NombreOuvragesProposes: vine.number().optional(),
    NombreCommentaires: vine.number().optional(),
    NombreAppreciations: vine.number().optional(),
  })
)

const updateUserValidator = vine.compile(
  vine.object({
    pseudo: vine.string().trim().minLength(3).maxLength(255).optional(),
    password: vine.string().trim().minLength(6).maxLength(255).optional(),
    isAdmin: vine.boolean().optional(),
    NombreOuvragesProposes: vine.number().optional(),
    NombreCommentaires: vine.number().optional(),
    NombreAppreciations: vine.number().optional(),
  })
)
export { createUserValidator, updateUserValidator }
