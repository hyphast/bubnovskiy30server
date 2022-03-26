import { UserDocument } from '../schemas/user.schema'

export interface IGetUsers {
  users: Array<UserDocument>
  countDocuments: string
}
