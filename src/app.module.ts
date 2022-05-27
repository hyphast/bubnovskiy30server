import { Module } from '@nestjs/common'
import * as path from 'path'
import { MongooseModule } from '@nestjs/mongoose'
import { MailerModule } from '@nestjs-modules/mailer'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { MailModule } from './mail/mail.module'
import { TokenModule } from './token/token.module'
import { AppointmentsModule } from './appointments/appointments.module'
import { HandlersModule } from './handlers/handlers.module'
import { RecordsModule } from './records/records.module'
import { ProfileModule } from './profile/profile.module'
import { FilesModule } from './files/files.module'
import { ServeStaticModule } from '@nestjs/serve-static'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
      serveRoot: '/api',
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
    RecordsModule,
    ProfileModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
