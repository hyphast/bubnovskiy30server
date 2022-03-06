import { IsDefined, IsEmail, IsString, Length } from 'class-validator'

export class SignInUserDto {
  @IsDefined({ message: 'Email не задан' })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Email имеет неверный формат' })
  readonly email: string

  @IsDefined({ message: 'Пароль не задан' })
  @IsString({ message: 'Должно быть строкой' })
  @Length(6, 32, { message: 'Пароль должен быть не меньше 4 и не больше 16' })
  readonly password: string
}
