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
  async registerWeb({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)
    const user = await User.create(payload)

    await auth.use('web').login(user)

    return response.redirect('/dashboard')
  }
  async loginWeb({ request, auth, response }: HttpContext) {
    const { pseudo, password } = request.all()
    const user = await User.verifyCredentials(pseudo, password)

    await auth.use('web').login(user)

    return response.redirect('/dashboard')
  }
  async logoutApi({ auth, response }: HttpContext) {
    const guard = auth.use('api')
    await guard.authenticate()
    const user = guard.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return response.ok({ revoked: true })
  }
  async logoutWeb({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.ok({ message: 'Logged out from session' })
  }
}
