import vine, { VineObject } from '@vinejs/vine'

const postBookValidator = vine.compile(
  vine.object({
    test: vine.string(),
  })
)

export { postBookValidator }
