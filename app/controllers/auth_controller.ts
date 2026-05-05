import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator } from '#validators/register'
export default class AuthController {
  async loginApi({ request }: HttpContext) {
    const { pseudo, password } = request.all()

    const user = await User.verifyCredentials(pseudo, password)

    const token = await User.accessTokens.create(user)

    return {
      type: 'bearer',
      value: token.value!.release(),
    }
  }
  async registerApi({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)
    const user = await User.create(payload)
    const token = await User.accessTokens.create(user)
    return response.created({
      type: 'bearer',
      value: token.value!.release(),
    })
  }
  async logoutApi({ auth, response }: HttpContext) {
    const guard = auth.use('api')
    await guard.authenticate()
    const user = guard.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return response.ok({ revoked: true })
  }
}
