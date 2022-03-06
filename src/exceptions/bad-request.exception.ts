import { HttpException, HttpStatus } from '@nestjs/common'
import { IErrorsException } from './interfaces/errors-exception.interface'

export class BadRequestException extends HttpException {
  message: string
  errors: IErrorsException[]
  type: 'error'

  constructor(message: string, errors: IErrorsException[]) {
    super(message, HttpStatus.BAD_REQUEST)
    this.message = message
    this.errors = errors
    this.type = 'error'
  }
}
