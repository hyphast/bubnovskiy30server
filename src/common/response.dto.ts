import { ApiProperty } from '@nestjs/swagger'

export class ResponseDto {
  @ApiProperty({
    example: 'Запись была удалена и перемещена в архив',
    description: 'Response message',
  })
  readonly message: string

  @ApiProperty({ example: 'warning', description: 'Response type' })
  readonly type: 'error' | 'warning' | 'info'

  @ApiProperty({ example: '/records', description: 'Redirect to' })
  readonly redirect?: '/records' | '/profile'

  constructor(message, type, redirect) {
    this.message = message
    this.type = type
    this.redirect = redirect
  }
}
