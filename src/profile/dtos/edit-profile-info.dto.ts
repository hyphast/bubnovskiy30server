import { IsDefined, IsPhoneNumber, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class EditProfileInfoDto {
  @IsDefined({ message: 'Имя не задано' })
  @IsString({ message: 'Должно быть строкой' })
  @ApiProperty({ example: '', description: 'First name' })
  readonly firstName: string

  @IsDefined({ message: 'Фамилия не задана' })
  @IsString({ message: 'Должно быть строкой' })
  @ApiProperty({ example: '', description: 'Second name' })
  readonly lastName: string

  @IsDefined({ message: 'Отчество не задано' })
  @IsString({ message: 'Должно быть строкой' })
  @ApiProperty({ example: '', description: 'Patronymic' })
  readonly patronymic: string

  @IsDefined({ message: 'Пол не задан' })
  @ApiProperty({ example: 'male', description: 'Gender' })
  readonly gender: 'male' | 'female'

  @IsDefined({ message: 'Номер телефона не задан' })
  @IsString({ message: 'Должно быть строкой' })
  @IsPhoneNumber('RU')
  @ApiProperty({ example: '+79213441126', description: 'Phone number' })
  readonly phoneNumber: string
}
