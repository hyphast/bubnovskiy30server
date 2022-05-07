import {
  IsEmail,
  IsDefined,
  Length,
  IsPhoneNumber,
  IsString,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @IsDefined({ message: 'Имя не задано' })
  @IsString({ message: 'Должно быть строкой' })
  @ApiProperty({ example: 'Иван', description: 'First name' })
  readonly firstName: string

  @IsDefined({ message: 'Фамилия не задана' })
  @IsString({ message: 'Должно быть строкой' })
  @ApiProperty({ example: 'Иванов', description: 'Last name' })
  readonly lastName: string

  @IsString({ message: 'Должно быть строкой' })
  @ApiProperty({ example: 'Иванович', description: 'Patronymic' })
  readonly patronymic: string

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

  @IsDefined({ message: 'Пол не задан' })
  @ApiProperty({ example: 'male', description: 'Gender' })
  readonly gender: 'male' | 'female'

  @IsDefined({ message: 'Номер телефона не задан' })
  @IsString({ message: 'Должно быть строкой' })
  @IsPhoneNumber('RU')
  @ApiProperty({ example: '+79213441126', description: 'Phone number' })
  readonly phoneNumber: string

  @IsDefined({ message: 'captchaToken не задан' })
  @IsString({ message: 'Должно быть строкой' })
  @ApiProperty({ example: '1fz346ff343ar5ds1236', description: 'captchaToken' })
  readonly captchaToken: string
}
