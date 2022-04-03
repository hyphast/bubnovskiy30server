import { forwardRef, Module } from '@nestjs/common'
import { RecordsController } from './records.controller'
import { RecordsService } from './records.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Record, RecordSchema } from './schemas/record.schema'
import { AppointmentsModule } from '../appointments/appointments.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Record.name, schema: RecordSchema }]),
    forwardRef(() => AppointmentsModule),
  ],
  controllers: [RecordsController],
  providers: [RecordsService],
  exports: [RecordsService],
})
export class RecordsModule {}
