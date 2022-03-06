import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendActivationMail(to: string, link: string): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: 'Активация аккаунта на ' + process.env.apiUrl,
      text: '',
      html: `
        <div>
            <h1>Для активации личного кабинета перейдите по ссылке ниже</h1>
            <a href="${link}">${link}</a>
        </div>
      `,
    })
  }
}
