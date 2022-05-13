import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import * as mongoose from 'mongoose'
import { Document } from 'mongoose'
import { AppointmentsType } from '../../common/types/appointments-type.type'

export type RecordDocument = Record & Document

@Schema()
export class Record {
  // @Prop()
  // @ApiProperty({
  //   example: '61f590407d7b11596c986259',
  //   description: 'Appointment id',
  // })
  // appointmentId: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' }) //TODO Is there required field ?
  @ApiProperty({ example: '6181415b10cca71d04128705', description: 'User id' })
  userId: string

  @Prop({ type: Date })
  @ApiProperty({
    example: '2021-11-11T07:50:27.000+00:00',
    description: 'Date of record',
  })
  date: string

  @Prop({ type: Date })
  @ApiProperty({
    example: '1970-01-01T05:30:00.000+00:00',
    description: 'Time of record',
  })
  time: string

  @Prop()
  @ApiProperty({ example: 'Treatment', description: 'Type of appointment' })
  appointmentType: AppointmentsType

  @Prop()
  @ApiProperty({
    example: 'Услуга отменена',
    description: 'Status of record',
  })
  status: string

  @Prop({ type: Date })
  @ApiProperty({
    example: '2021-11-11T07:50:27.000+00:00',
    description: 'Modified date of record',
  })
  modifiedDate: string | Date

  // @Prop({ type: Date, expires: 20, default: Date }) //TODO expires: 15 638 400 !!!!!
  // @ApiProperty({
  //   example: '2021-11-11T07:50:27.000+00:00',
  //   description: 'Modified date of record',
  // })
  // expireAt: string | Date
}
export const RecordSchema = SchemaFactory.createForClass(Record)
