import mongoose, { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'

export type PatientsDocument = Patients & Document

@Schema()
export class Patients {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Record' })
  @ApiProperty({
    example: '61f590407d7b11596c98621c',
    description: 'Record id',
  })
  record: string
}
export const patientsSchema = SchemaFactory.createForClass(Patients)
