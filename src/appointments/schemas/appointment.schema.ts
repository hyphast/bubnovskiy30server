import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document } from 'mongoose'
import {
  AppointmentsCell,
  AppointmentsCellSchema,
} from './appointments-cell.schema'

export type AppointmentDocument = Appointment & Document

@Schema()
export class Appointment {
  @Prop({ type: Date })
  @ApiProperty({
    example: '2022-02-05T19:06:39.000+00:00',
    description: 'Date of appointment',
  })
  date: string

  @Prop({ type: [AppointmentsCellSchema] })
  @ApiProperty({
    example: AppointmentsCell,
    description: 'Appointments for a specific time',
  })
  appointments: Array<AppointmentsCell>

  @Prop()
  @ApiProperty({ example: 5, description: 'Number of patients for this day' })
  numberAllPatients: number
}
export const AppointmentSchema = SchemaFactory.createForClass(Appointment)
