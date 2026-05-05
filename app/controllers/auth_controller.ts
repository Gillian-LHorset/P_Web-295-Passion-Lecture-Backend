import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator } from '#validators/register'
import { UnauthorizedException, ValidationException } from '#exceptions/api_exception'

export default class AuthController {
  async loginApi({ request }: HttpContext) {
    try {
      const { pseudo, password } = request.all()

      if (!pseudo || !password) {
        throw new ValidationException('Missing pseudo or password', {
          pseudo: pseudo ? [] : ['Pseudo is required'],
          password: password ? [] : ['Password is required'],
        })
      }

      const user = await User.verifyCredentials(pseudo, password)

      const token = await User.accessTokens.create(user)

      return {
        success: true,
        type: 'bearer',
        value: token.value!.release(),
      }
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error
      }
      if (error instanceof Error && error.message.includes('Credentials')) {
        throw new UnauthorizedException('Invalid credentials')
      }
      throw error
    }
  }

  async registerApi({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator)
      const user = await User.create(payload)
      const token = await User.accessTokens.create(user)

      return response.created({
        success: true,
        type: 'bearer',
        value: token.value!.release(),
      })
    } catch (error) {
      throw error
    }
  }

  async logoutApi({ auth, response }: HttpContext) {
    try {
      const guard = auth.use('api')
      await guard.authenticate()
      const user = guard.user!
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)

      return response.ok({ success: true, revoked: true })
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unauthenticated')) {
        throw new UnauthorizedException('Unauthenticated')
      }
      throw error
    }
  }
}
