import { HttpException, HttpStatus } from '@nestjs/common'

export class ValidationException extends HttpException {
  errors: string[]

  constructor(response: string[]) {
    super(response, HttpStatus.BAD_REQUEST)
    this.errors = response
  }
}
