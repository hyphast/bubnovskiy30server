import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { MailerModule } from '@nestjs-modules/mailer'
import { ConfigModule } from '@nestjs/config'
import { AuthController } from './auth/auth.controller'
import { AuthModule } from './auth/auth.module'
import { UsersController } from './users/users.controller'
import { UsersModule } from './users/users.module'
import { MailModule } from './mail/mail.module'
import { TokenModule } from './token/token.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.mongoUri),
    MailerModule.forRoot({
      transport: {
        host: process.env.smtpHost,
        port: parseInt(process.env.smtpPort),
        secure: false,
        auth: {
          user: process.env.smtpUser,
          pass: process.env.smtpPassword,
        },
      },
      defaults: {
        from: process.env.smtpUser,
      },
    }),
    AuthModule,
    UsersModule,
    MailModule,
    TokenModule,
  ],
  controllers: [AppController, AuthController, UsersController],
  providers: [AppService],
})
export class AppModule {}
