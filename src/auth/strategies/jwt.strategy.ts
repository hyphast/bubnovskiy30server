import { Injectable } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { IRequestWithUserPayload } from '../interfaces/request-with-user-payload.dto'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.jwtAccessSecret,
    })
  }

  async validate(payload): Promise<IRequestWithUserPayload> {
    const { iat, exp, ...userData } = payload
    return userData
  }
}
