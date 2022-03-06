import { UserDocument } from '../../users/schemas/user.schema'
import { Types } from 'mongoose'

export class UserPayloadDto {
  readonly id: Types.ObjectId
  readonly email: string
  readonly isActivated: boolean

  constructor(user: UserDocument) {
    this.id = user._id
    this.email = user.email
    this.isActivated = user.isActivated
  }
}
