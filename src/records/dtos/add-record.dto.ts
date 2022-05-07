import { IsDefined, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { AppointmentsType } from '../../common/types/appointments-type.type'
import { Prop } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export class AddRecordDto {
  @IsDefined({ message: 'Record id не задан' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Record' })
  @ApiProperty({
    example: '61f590407d7b11596c98621c',
    description: 'Record id',
  })
  record: string

  // @IsDefined({ message: 'Время не задано' })
  // @IsString({ message: 'Должно быть строкой' })
  // @ApiProperty({
  //   example: '2022-02-05T19:06:39.000+00:00',
  //   description: 'Time of record',
  // })
  // readonly time: string
  //
  // @IsDefined({ message: 'Тип занятия не задан' })
  // @IsString({ message: 'Должно быть строкой' })
  // @ApiProperty({
  //   example: 'Лечебные занятия',
  //   description: 'Type of appointment',
  // })
  // readonly appointmentType: AppointmentsType
  //
  @IsDefined({ message: 'User id не задан' })
  @IsString({ message: 'Должно быть строкой' })
  @ApiProperty({ example: '6181415b10cca71d04128705', description: 'User id' })
  readonly userId: string
}
