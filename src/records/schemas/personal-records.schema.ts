import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import * as mongoose from 'mongoose'
import { Document } from 'mongoose'
import { FinishedRecord, FinishedRecordSchema } from './finished-record.schema'
import { UpcomingRecord, UpcomingRecordSchema } from './upcoming-record.schema'

export type PersonalRecordsDocument = PersonalRecords & Document

@Schema()
export class PersonalRecords {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' }) //TODO Is there required field ?
  @ApiProperty({ example: '6181415b10cca71d04128705', description: 'User id' })
  user: string

  @Prop({ type: [UpcomingRecordSchema] })
  @ApiProperty({
    example: 'UpcomingRecord',
    description: 'Array of upcoming records IDs',
  })
  upcomingRecords: Array<UpcomingRecord>

  @Prop({ type: [FinishedRecordSchema] })
  @ApiProperty({
    example: 'FinishedRecord',
    description: 'Array of finished records IDs',
  })
  finishedRecords: Array<FinishedRecord>

  @Prop()
  @ApiProperty({
    example: '3',
    description: 'Number of modified',
  })
  modifiedNumber: number
}
export const PersonalRecordsSchema =
  SchemaFactory.createForClass(PersonalRecords)
