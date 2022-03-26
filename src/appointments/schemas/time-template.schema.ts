import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document } from 'mongoose'

export type TimeTemplateDocument = TimeTemplate & Document

@Schema()
export class TimeTemplate {
  @Prop({ type: Date })
  @ApiProperty({
    example: '1970-01-01T10:30:00.000+00:00',
    description: 'Time',
  })
  time: string
}
export const TimeTemplateSchema = SchemaFactory.createForClass(TimeTemplate)
