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
            <a href='${link}'>${link}</a>
        </div>
      `,
    })
  }

  async sendSuccessMail(to: string, date: string, time: string): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: 'Центр Доктора Бубновского в Астрахани',
      text: '',
      html: `
        <div>
            <p>Вы записались на занятие на ${date} в ${time}</p>
            <p>Наш адрес: ул. Адмиралтейская 15, ТЦ Премиум Холл 5 этаж</p>
            <p>Телефон: 7 (8512) 669-777 или 8-927-074-23-34</p>
        </div>
      `,
    })
  }
}
