import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Patients, patientsSchema } from './patients.schema'

export type AppointmentsCellDocument = AppointmentsCell & Document

@Schema()
export class AppointmentsCell {
  @Prop({ type: Date })
  @ApiProperty({
    example: '1970-01-01T04:00:00.000+00:00',
    description: 'Time of appointment',
  })
  time: string

  @Prop({ type: [patientsSchema] }) //TODO Look up this information here: https://stackoverflow.com/questions/62704600/mongoose-subdocuments-in-nest-js
  @ApiProperty({
    example: Patients,
    description: 'Appointments patients',
  })
  patients: Array<Patients> | []

  @Prop()
  @ApiProperty({
    example: 12,
    description: 'Max number of patients that can be recorded',
  })
  maxNumberPatients: number
}
export const AppointmentsCellSchema =
  SchemaFactory.createForClass(AppointmentsCell)
