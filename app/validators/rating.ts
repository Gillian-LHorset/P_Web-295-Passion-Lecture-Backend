import vine from '@vinejs/vine'

const createRatingValidator = vine.compile(
  vine.object({
    note: vine.number().min(1).max(5),
  })
)

export { createRatingValidator }
