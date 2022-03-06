import { Module } from '@nestjs/common'
import { MailModule } from '../mail/mail.module'
import { AuthService } from './auth.service'
import { UsersModule } from '../users/users.module'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './strategies/jwt.strategy'
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy'
import { TokenModule } from '../token/token.module'

@Module({
  imports: [MailModule, UsersModule, PassportModule, TokenModule],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
