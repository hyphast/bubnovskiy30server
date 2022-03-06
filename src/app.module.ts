import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { MailerModule } from '@nestjs-modules/mailer'
import { ConfigModule } from '@nestjs/config'
import { AuthController } from './auth/auth.controller'
import { AuthModule } from './auth/auth.module'
import { mailConfig } from './mail-config'
import { UsersService } from './users/users.service'
import { UsersController } from './users/users.controller'
import { UsersModule } from './users/users.module'
import { MailModule } from './mail/mail.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.mongoUri),
    MailerModule.forRoot(mailConfig),
    AuthModule,
    UsersModule,
    MailModule,
  ],
  controllers: [AppController, AuthController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
