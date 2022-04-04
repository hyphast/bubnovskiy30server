import { Document, Types } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { AppointmentsType } from '../../common/types/appointments-type.type'

export type PatientsDocument = Patients & Document

@Schema()
export class Patients {
  @Prop()
  @ApiProperty({
    example: '61f590407d7b11596c986259',
    description: 'Appointment id',
  })
  appointmentId: string

  @Prop({ type: Types.ObjectId, ref: 'User' })
  @ApiProperty({ example: '61f590407d7b11596c98621c', description: 'User id' })
  userId: string

  @Prop()
  @ApiProperty({ example: 'Treatment', description: 'Type of appointment' })
  appointmentType: AppointmentsType
}
export const patientsSchema = SchemaFactory.createForClass(Patients)
