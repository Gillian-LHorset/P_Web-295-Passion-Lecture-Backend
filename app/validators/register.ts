import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    pseudo: vine.string().unique({ table: 'users', column: 'pseudo' }),
    password: vine.string().trim().minLength(6).maxLength(255),
  })
)
