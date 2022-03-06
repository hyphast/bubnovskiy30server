import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MailModule } from '../mail/mail.module'
import { AuthService } from './auth.service'
import { UsersModule } from '../users/users.module'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './strategies/jwt.strategy'
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy'
import { Token, TokenSchema } from './schemas/token.schema'

@Module({
  imports: [
    MailModule,
    UsersModule,
    PassportModule,
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
