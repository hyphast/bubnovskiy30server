import { Injectable } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { UserPayloadDto } from '../dto/user-payload.dto'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.jwtAccessSecret,
    })
  }

  async validate(payload: UserPayloadDto): Promise<UserPayloadDto> {
    return payload
  }
}
