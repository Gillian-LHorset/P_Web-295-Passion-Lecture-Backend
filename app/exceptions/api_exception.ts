import { Exception } from '@adonisjs/core/exceptions'

export class ApiException extends Exception {
  static status = 400
  static code = 'E_API_ERROR'

  constructor(
    message: string,
    code: string = 'E_API_ERROR',
    status: number = 400,
    public meta?: Record<string, any>
  ) {
    super(message, { status, code })
    this.code = code
  }
}

export class NotFoundException extends ApiException {
  static status = 404
  static code = 'E_NOT_FOUND'

  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 'E_NOT_FOUND', 404)
  }
}

export class ValidationException extends ApiException {
  static status = 422
  static code = 'E_VALIDATION_ERROR'

  constructor(
    message: string = 'Validation failed',
    public errors?: Record<string, string[]>
  ) {
    super(message, 'E_VALIDATION_ERROR', 422)
  }
}

export class UnauthorizedException extends ApiException {
  static status = 401
  static code = 'E_UNAUTHORIZED'

  constructor(message: string = 'Unauthorized') {
    super(message, 'E_UNAUTHORIZED', 401)
  }
}

export class ForbiddenException extends ApiException {
  static status = 403
  static code = 'E_FORBIDDEN'

  constructor(message: string = 'Forbidden') {
    super(message, 'E_FORBIDDEN', 403)
  }
}

export class ConflictException extends ApiException {
  static status = 409
  static code = 'E_CONFLICT'

  constructor(message: string = 'Conflict') {
    super(message, 'E_CONFLICT', 409)
  }
}
