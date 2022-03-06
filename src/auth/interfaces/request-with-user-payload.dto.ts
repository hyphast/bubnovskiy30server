import { Request } from 'express'
import { UserPayloadDto } from '../dto/user-payload.dto'

export interface IRequestWithUserPayload extends Request {
  user: UserPayloadDto
}
