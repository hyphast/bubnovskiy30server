import { ApiProperty } from '@nestjs/swagger'
import { RecordDocument } from '../schemas/record.schema'
import { UpcomingRecord } from '../schemas/upcoming-record.schema'
import { FinishedRecord } from '../schemas/finished-record.schema'

export class RecordPayloadDto {
  @ApiProperty({
    example: 'UpcomingRecord',
    description: 'Upcoming records',
  })
  readonly upcomingRecords: Array<UpcomingRecord>

  @ApiProperty({
    example: 'FinishedRecord',
    description: 'Finished records',
  })
  readonly finishedRecords: Array<FinishedRecord>

  constructor(record: RecordDocument) {
    this.upcomingRecords = record.upcomingRecords
    this.finishedRecords = record.finishedRecords
  }
}
