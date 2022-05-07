import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { AppointmentsType } from '../../common/types/appointments-type.type'
import mongoose from 'mongoose'

export type FinishedRecordDocument = FinishedRecord & Document

@Schema()
export class FinishedRecord {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Record' })
  @ApiProperty({
    example: '618ac0ae637b63304452e7a0',
    description: 'Record id',
  })
  record: string

  // @Prop({ type: Date })
  // @ApiProperty({
  //   example: '2021-11-11T07:50:27.000+00:00',
  //   description: 'Date of record',
  // })
  // date: string
  //
  // @Prop({ type: Date })
  // @ApiProperty({
  //   example: '1970-01-01T05:30:00.000+00:00',
  //   description: 'Time of record',
  // })
  // time: string
  //
  // @Prop()
  // @ApiProperty({
  //   example: 'Лечебные занятия',
  //   description: 'Type of appointment',
  // })
  // appointmentType: AppointmentsType
  //
  // @Prop()
  // @ApiProperty({
  //   example: 'Услуга отменена',
  //   description: 'Status of finished record',
  // })
  // status: string
}
export const FinishedRecordSchema = SchemaFactory.createForClass(FinishedRecord)
