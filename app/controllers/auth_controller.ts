import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator } from '#validators/register'
import { ValidationException } from '#exceptions/api_exception'

export default class AuthController {
  private formatErrorResponse(status: number, message: string, code: string, details?: any) {
    return {
      success: false,
      status,
      code,
      message,
      ...(details && { details }),
    }
  }

  private formatSuccessResponse(data: any, status: number = 200, message: string = 'Succès') {
    return {
      success: true,
      status,
      message,
      data,
    }
  }

  async loginApi({ request, response }: HttpContext) {
    try {
      const { pseudo, password } = request.all()

      if (!pseudo || !password) {
        const errors: Record<string, string[]> = {}
        if (!pseudo) errors.pseudo = ['Pseudo requis']
        if (!password) errors.password = ['Mot de passe requis']

        return response.badRequest(
          this.formatErrorResponse(400, 'Validation échouée', 'E_VALIDATION_ERROR', errors)
        )
      }

      try {
        const user = await User.verifyCredentials(pseudo, password)
        const token = await User.accessTokens.create(user)

        return response.ok(
          this.formatSuccessResponse(
            {
              type: 'bearer',
              value: token.value!.release(),
            },
            200,
            'Connexion réussie'
          )
        )
      } catch (credentialError) {
        return response.unauthorized(
          this.formatErrorResponse(401, 'Identifiants invalides', 'E_UNAUTHORIZED')
        )
      }
    } catch (error) {
      return response.internalServerError(
        this.formatErrorResponse(
          500,
          'Erreur interne du serveur',
          'E_INTERNAL_SERVER_ERROR',
          error instanceof Error ? error.message : 'Erreur inconnue'
        )
      )
    }
  }

  async registerApi({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator)

      try {
        const user = await User.create(payload)
        const token = await User.accessTokens.create(user)

        return response.created(
          this.formatSuccessResponse(
            {
              userId: user.id,
              type: 'bearer',
              value: token.value!.release(),
            },
            201,
            'Enregistrement réussi'
          )
        )
      } catch (dbError) {
        if (dbError instanceof Error && dbError.message.includes('unique')) {
          return response.badRequest(
            this.formatErrorResponse(400, "L'utilisateur existe déjà", 'E_USER_ALREADY_EXISTS')
          )
        }
        throw dbError
      }
    } catch (error) {
      if (error instanceof ValidationException) {
        return response.unprocessableEntity(
          this.formatErrorResponse(422, 'Validation échouée', 'E_VALIDATION_ERROR', error.errors)
        )
      }

      return response.internalServerError(
        this.formatErrorResponse(
          500,
          'Erreur interne du serveur',
          'E_INTERNAL_SERVER_ERROR',
          error instanceof Error ? error.message : 'Erreur inconnue'
        )
      )
    }
  }

  async logoutApi({ auth, response }: HttpContext) {
    try {
      const guard = auth.use('api')

      try {
        await guard.authenticate()
      } catch (authError) {
        return response.unauthorized(
          this.formatErrorResponse(401, 'Non authentifié', 'E_UNAUTHORIZED')
        )
      }

      const user = guard.user!

      try {
        await User.accessTokens.delete(user, user.currentAccessToken.identifier)

        return response.ok(
          this.formatSuccessResponse(
            {
              revoked: true,
            },
            200,
            'Déconnexion réussie'
          )
        )
      } catch (tokenError) {
        return response.internalServerError(
          this.formatErrorResponse(
            500,
            'Impossible de révoquer le jeton',
            'E_TOKEN_REVOKE_FAILED',
            tokenError instanceof Error ? tokenError.message : 'Erreur inconnue'
          )
        )
      }
    } catch (error) {
      return response.internalServerError(
        this.formatErrorResponse(
          500,
          'Erreur interne du serveur',
          'E_INTERNAL_SERVER_ERROR',
          error instanceof Error ? error.message : 'Erreur inconnue'
        )
      )
    }
  }
}
