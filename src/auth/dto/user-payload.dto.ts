import { UserDocument } from '../../users/schemas/user.schema'
import { Types } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'

export class UserPayloadDto {
  @ApiProperty({
    example: '6223f5f514f2a789fa3bca7d',
    description: 'User id',
    type: 'string',
  })
  readonly id: Types.ObjectId

  @ApiProperty({ example: 'email@gmail.com', description: 'Email address' })
  readonly email: string

  @ApiProperty({ example: 'true', description: 'Is account activated' })
  readonly isActivated: boolean

  constructor(user: UserDocument) {
    this.id = user._id
    this.email = user.email
    this.isActivated = user.isActivated
  }
}
