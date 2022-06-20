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
import { google } from 'googleapis'

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
    MailerModule.forRootAsync({
      useFactory: async () => {
        const OAuth2Client = new google.auth.OAuth2(
          process.env.smtpClientId,
          process.env.smtpClientSecret,
          process.env.smtpRedirectUri,
        )
        OAuth2Client.setCredentials({
          refresh_token: process.env.smtpRefreshToken,
        })
        const accessToken = await OAuth2Client.getAccessToken()
        return {
          transport: {
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: process.env.smtpEmail,
              clientId: process.env.smtpClientId,
              clientSecret: process.env.smtpClientSecret,
              refreshToken: process.env.smtpRefreshToken,
              accessToken: accessToken.token,
            },
          },
          defaults: {
            from: process.env.smtpUser,
          },
        }
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
