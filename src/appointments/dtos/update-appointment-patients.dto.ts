import { IsDefined, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { AppointmentsType } from '../../common/types/appointments-type.type'
import { Prop } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export class UpdateAppointmentPatientsDto {
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

  @IsDefined({ message: 'userId не задан' })
  @IsString({ message: 'Должно быть строкой' })
  @ApiProperty({
    example: '618ac0ae637b63304452e7a0',
    description: 'Record id',
  })
  readonly userId: string
}
