import vine from '@vinejs/vine'

const createCommentValidator = vine.compile(
  vine.object({
    contenu: vine.string().trim().minLength(1).maxLength(500),
  })
)

export { createCommentValidator }
