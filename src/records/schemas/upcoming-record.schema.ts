import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document } from 'mongoose'

export type UpcomingRecordDocument = UpcomingRecord & Document

@Schema()
export class UpcomingRecord {
  @Prop()
  @ApiProperty({
    example: '618ac0ae637b63304452e7a0',
    description: 'Appointment id',
  })
  appointmentId: string //TODO is it right?

  @Prop({ type: Date })
  @ApiProperty({
    example: '2021-11-11T07:50:27.000+00:00',
    description: 'Date of record',
  })
  date: string //TODO is it right?

  @Prop({ type: Date })
  @ApiProperty({
    example: '1970-01-01T05:30:00.000+00:00',
    description: 'Time of record',
  })
  time: string //TODO is it right?

  @Prop()
  @ApiProperty({
    example: 'Лечебные занятия', //TODO доделать
    description: 'Type of appointment',
  })
  appointmentType: string //TODO refactor
}
export const UpcomingRecordSchema = SchemaFactory.createForClass(UpcomingRecord)
