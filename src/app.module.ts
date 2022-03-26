import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MailerModule } from '@nestjs-modules/mailer'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { MailModule } from './mail/mail.module'
import { TokenModule } from './token/token.module'
import { AppointmentsModule } from './appointments/appointments.module'
import { HandlersModule } from './handlers/handlers.module'

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
    AppointmentsModule,
    HandlersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
