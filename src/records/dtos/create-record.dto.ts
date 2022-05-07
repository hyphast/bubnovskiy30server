import { IsDefined, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { AppointmentsType } from '../../common/types/appointments-type.type'

export class CreateRecordDto {
  @IsDefined({ message: 'Дата не задана' })
  @IsString({ message: 'Должно быть строкой' })
  @ApiProperty({
    example: '2022-02-05T19:06:39.000+00:00',
    description: 'Date of appointment',
  })
  readonly date: string

  @IsDefined({ message: 'Время не задано' })
  @IsString({ message: 'Должно быть строкой' })
  @ApiProperty({
    example: '1970-01-01T04:00:00.000+00:00',
    description: 'Time of appointment',
  })
  readonly time: string

  @IsString({ message: 'Должно быть строкой' })
  @ApiProperty({
    example: 'Лечебные занятия',
    description: 'Type of appointment',
  })
  readonly appointmentType: AppointmentsType

  @IsDefined({ message: 'User Id не задан' })
  @IsString({ message: 'Должно быть строкой' })
  @ApiProperty({ example: '61f590407d7b11596c98621c', description: 'User id' })
  readonly userId: string

  @IsDefined({ message: 'Статус не задан' })
  @IsString({ message: 'Должно быть строкой' })
  @ApiProperty({
    example: 'Услуга отменена',
    description: 'Status of record',
  })
  status: string
}
