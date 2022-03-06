import {
  IsEmail,
  IsDefined,
  Length,
  IsPhoneNumber,
  IsString,
} from 'class-validator'

export class CreateUserDto {
  @IsDefined({ message: 'Имя не задано' })
  @IsString({ message: 'Должно быть строкой' })
  readonly firstName: string

  @IsDefined({ message: 'Фамилия не задана' })
  @IsString({ message: 'Должно быть строкой' })
  readonly lastName: string

  @IsString({ message: 'Должно быть строкой' })
  readonly patronymic: string

  @IsDefined({ message: 'Email не задан' })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Email имеет неверный формат' })
  readonly email: string

  @IsDefined({ message: 'Пароль не задан' })
  @IsString({ message: 'Должно быть строкой' })
  @Length(6, 32, { message: 'Пароль должен быть не меньше 4 и не больше 16' })
  readonly password: string

  @IsDefined({ message: 'Пол не задан' })
  readonly gender: 'male' | 'female'

  @IsDefined({ message: 'Номер телефона не задан' })
  @IsString({ message: 'Должно быть строкой' })
  @IsPhoneNumber('RU')
  readonly phoneNumber: string
}
