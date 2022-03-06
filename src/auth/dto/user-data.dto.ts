import { UserPayloadDto } from './user-payload.dto'
import { ApiProperty } from '@nestjs/swagger'

export class UserDataDto {
  @ApiProperty({ example: UserPayloadDto, description: 'User data' })
  readonly user: UserPayloadDto

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMjRmMmY3MTUxZWNmZTdkOWE3NzMwMCI',
    description: 'Access token',
  })
  readonly accessToken: string

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMjRmMmY3MTUxZWNmZTdkOWE3NzMwMCIsImVt',
    description: 'Refresh token',
  })
  readonly refreshToken: string
}
