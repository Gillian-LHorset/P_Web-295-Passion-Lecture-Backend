import vine from '@vinejs/vine'
import User from '#models/user'

export const registerValidator = vine.compile(
  vine.object({
    pseudo: vine.string().unique({ table: 'users', column: 'pseudo' }),
    password: vine.string().trim().minLength(6).maxLength(255),
  })
)
