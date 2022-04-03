import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import * as mongoose from 'mongoose'
import { Document } from 'mongoose'
import { FinishedRecord, FinishedRecordSchema } from './finished-record.schema'
import { UpcomingRecord, UpcomingRecordSchema } from './upcoming-record.schema'

export type RecordDocument = Record & Document

@Schema()
export class Record {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' }) //TODO Is there required field ?
  @ApiProperty({ example: '6181415b10cca71d04128705', description: 'User id' })
  user: string

  @Prop({ type: [UpcomingRecordSchema] })
  @ApiProperty({
    example: 'UpcomingRecord',
    description: 'Array of upcoming records',
  })
  upcomingRecords: Array<UpcomingRecord>

  @Prop({ type: [FinishedRecordSchema] })
  @ApiProperty({
    example: 'FinishedRecord',
    description: 'Array of finished records',
  })
  finishedRecords: Array<FinishedRecord>
}
export const RecordSchema = SchemaFactory.createForClass(Record)
