import { IsDefined, IsEmail, IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SignInUserDto {
  @IsDefined({ message: 'Email не задан' })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Email имеет неверный формат' })
  @ApiProperty({ example: 'email@gmail.com', description: 'Email address' })
  readonly email: string

  @IsDefined({ message: 'Пароль не задан' })
  @IsString({ message: 'Должно быть строкой' })
  @Length(6, 32, { message: 'Пароль должен быть не меньше 4 и не больше 16' })
  @ApiProperty({ example: '1fz345ds1236', description: 'Password' })
  readonly password: string

  @IsDefined({ message: 'captchaToken не задан' })
  @IsString({ message: 'Должно быть строкой' })
  @ApiProperty({ example: '1fz346ff343ar5ds1236', description: 'captchaToken' })
  readonly captchaToken: string
}
