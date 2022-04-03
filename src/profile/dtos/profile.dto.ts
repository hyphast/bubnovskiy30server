import { ApiProperty } from '@nestjs/swagger'
import { UserDocument } from '../../users/schemas/user.schema'

export class ProfileDto {
  @ApiProperty({
    example: '6223f5f514f2a789fa3bca7d',
    description: 'User id',
  })
  readonly id: string

  @ApiProperty({
    example: 'data:...',
    description: 'Data url',
  })
  readonly photoUrl: string

  @ApiProperty({ example: 'Иван', description: 'First name' })
  readonly firstName: string

  @ApiProperty({ example: 'Иванов', description: 'Last name' })
  readonly lastName: string

  @ApiProperty({ example: 'Иванович', description: 'Patronymic' })
  readonly patronymic: string

  @ApiProperty({ example: 'male', description: 'Gender' })
  readonly gender: 'male' | 'female'

  @ApiProperty({ example: '+79213441126', description: 'Phone number' })
  readonly phoneNumber: string

  @ApiProperty({ example: 'true', description: 'Is account activated' })
  readonly isActivated: boolean

  constructor(user: UserDocument) {
    this.id = user._id
    this.photoUrl = user.photoUrl
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.patronymic = user.patronymic
    this.gender = user.gender
    this.phoneNumber = user.phoneNumber
    this.isActivated = user.isActivated
  }
}
