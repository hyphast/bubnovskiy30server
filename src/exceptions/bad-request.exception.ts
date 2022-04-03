import { HttpException, HttpStatus } from '@nestjs/common'
import { IErrorsException } from './interfaces/errors-exception.interface'
import { ApiProperty } from '@nestjs/swagger'

export class BadRequestException extends HttpException {
  @ApiProperty({
    example: 'Некоторая ошибка',
    description: 'Exception message',
  })
  message: string

  @ApiProperty({
    example: [{ email: 'Некоторая ошибка' }],
    description: 'Exception errors',
  })
  errors: IErrorsException[]

  @ApiProperty({
    example: 'error',
    description: 'Exception type',
  })
  type: 'error' | 'warning'

  constructor(message: string, errors: IErrorsException[] = []) {
    super({ message, errors, type: 'error' }, HttpStatus.BAD_REQUEST)
    this.message = message
    this.errors = errors
    this.type = 'error'
  }
}
