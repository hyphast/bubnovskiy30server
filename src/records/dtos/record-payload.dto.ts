import { ApiProperty } from '@nestjs/swagger'
import { PersonalRecordsDocument } from '../schemas/personal-records.schema'
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

  @ApiProperty({ example: '3', description: 'Number of modified' })
  readonly modifiedNumber: number

  constructor(record: PersonalRecordsDocument) {
    this.upcomingRecords = record.upcomingRecords
    this.finishedRecords = record.finishedRecords
    this.modifiedNumber = record.modifiedNumber
  }
}
