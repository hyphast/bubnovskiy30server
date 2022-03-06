import { IJWTTokens } from './jwt-tokens.interface'
import { UserPayloadDto } from '../dto/user-payload.dto'

export interface IUserData extends IJWTTokens {
  user: UserPayloadDto
}
