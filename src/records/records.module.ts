import { forwardRef, Module } from '@nestjs/common'
import { RecordsController } from './records.controller'
import { RecordsService } from './records.service'
import { MongooseModule } from '@nestjs/mongoose'
import {
  PersonalRecords,
  PersonalRecordsSchema,
} from './schemas/personal-records.schema'
import { Record, RecordSchema } from './schemas/record.schema'
import { AppointmentsModule } from '../appointments/appointments.module'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PersonalRecords.name, schema: PersonalRecordsSchema },
    ]),
    MongooseModule.forFeature([{ name: Record.name, schema: RecordSchema }]),
    forwardRef(() => AppointmentsModule),
    UsersModule,
  ],
  controllers: [RecordsController],
  providers: [RecordsService],
  exports: [RecordsService],
})
export class RecordsModule {}
