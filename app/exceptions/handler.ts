import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { ApiException, ValidationException } from './api_exception.js'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    // Handle custom API exceptions
    if (error instanceof ApiException) {
      return ctx.response.status(error.status).send({
        success: false,
        code: error.code,
        message: error.message,
        ...(error.meta && { meta: error.meta }),
        ...(error instanceof ValidationException && error.errors && { errors: error.errors }),
      })
    }

    // Handle validation errors from validators
    if (error instanceof Error && error.constructor.name === 'E_VALIDATION_FAILURE') {
      const validationError: any = error
      return ctx.response.status(422).send({
        success: false,
        code: 'E_VALIDATION_ERROR',
        message: 'Validation failed',
        errors: validationError.messages || {},
      })
    }

    // Handle not found errors from Lucid ORM
    if (error instanceof Error && error.message.includes('Cannot find row')) {
      return ctx.response.status(404).send({
        success: false,
        code: 'E_NOT_FOUND',
        message: 'Resource not found',
      })
    }

    // Handle authentication errors
    if (error instanceof Error && error.message.includes('Invalid credentials')) {
      return ctx.response.status(401).send({
        success: false,
        code: 'E_INVALID_CREDENTIALS',
        message: 'Invalid credentials',
      })
    }

    // Default error handling
    const status = (error as any).status || 500
    const code = (error as any).code || 'E_INTERNAL_SERVER_ERROR'
    const message = (error as any).message || 'Internal server error'

    return ctx.response.status(status).send({
      success: false,
      code,
      message,
      ...(this.debug && { stack: (error as Error).stack }),
    })
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
