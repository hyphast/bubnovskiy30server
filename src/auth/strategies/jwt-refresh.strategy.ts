import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'
import { AuthService } from '../auth.service'
import { UserDocument } from '../../users/schemas/user.schema'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: (req) => {
        let token = null
        if (req && req.cookies) {
          token = req.cookies['refreshToken']
        }
        return token
      },
      ignoreExpiration: false,
      secretOrKey: process.env.jwtRefreshSecret,
      passReqToCallback: true,
    })
  }

  async validate(req: Request, payload): Promise<UserDocument> {
    const refreshToken = req.cookies?.refreshToken
    const userData = await this.authService.validateRefreshToken(
      refreshToken,
      payload.id,
    )

    return userData
  }
}
