import { PersonalRecordsDocument } from '../schemas/personal-records.schema'
import { RecordDocument } from '../schemas/record.schema'

export interface IPopulatedPersonalRecords
  extends Omit<PersonalRecordsDocument, 'upcomingRecords' | 'finishedRecords'> {
  upcomingRecords: Array<{ record: RecordDocument }>
  finishedRecords: Array<{ record: RecordDocument }>
}
