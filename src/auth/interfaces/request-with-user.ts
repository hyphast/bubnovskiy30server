import { Request } from 'express'
import { UserDocument } from '../../users/schemas/user.schema'

export interface IRequestWithUser extends Request {
  user: UserDocument
}
