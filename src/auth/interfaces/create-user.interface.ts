import { UserDocument } from '../../users/schemas/user.schema'

export interface CreateUserInterface {
  user: UserDocument
  activationLink: string
}
