import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document, Types } from 'mongoose'

export type AppointmentDocument = Appointment & Document

@Schema()
export class PatientsCell {
  @Prop()
  @ApiProperty({
    example: '61f590407d7b11596c986259',
    description: 'Appointment id',
  })
  appointmentId: string

  @Prop({ type: Types.ObjectId, ref: 'User' })
  @ApiProperty({ example: '61f590407d7b11596c98621c', description: 'User id' })
  userId: Types.ObjectId

  @Prop()
  @ApiProperty({ example: 'Treatment', description: 'Type of appointment' })
  appointmentType: string // TODO There must be specific appointments types
}
export const patientsCellSchema = SchemaFactory.createForClass(PatientsCell)

@Schema()
export class AppointmentsCell {
  @Prop({ type: Date })
  @ApiProperty({
    example: '1970-01-01T04:00:00.000+00:00',
    description: 'Time of appointment',
  })
  time: string

  @Prop({ type: [patientsCellSchema] }) //TODO Look up this information here: https://stackoverflow.com/questions/62704600/mongoose-subdocuments-in-nest-js
  @ApiProperty({
    example: PatientsCell,
    description: 'Appointments patients',
  })
  patients: Array<PatientsCell> | []

  @Prop()
  @ApiProperty({
    example: 12,
    description: 'Max number of patients that can be recorded',
  })
  maxNumberPatients: number
}
export const AppointmentsCellSchema =
  SchemaFactory.createForClass(AppointmentsCell)

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
