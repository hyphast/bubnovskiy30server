import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'

export type FinishedRecordDocument = FinishedRecord & Document

@Schema()
export class FinishedRecord {
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
  appointmentType: string //TODO refactor!

  @Prop()
  @ApiProperty({
    example: 'Услуга отменена', //TODO доделать
    description: 'Status of finished record',
  })
  status: string //TODO refactor!
}
export const FinishedRecordSchema = SchemaFactory.createForClass(FinishedRecord)
