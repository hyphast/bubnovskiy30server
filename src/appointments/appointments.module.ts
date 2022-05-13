import { forwardRef, Module } from '@nestjs/common'
import { AppointmentsService } from './appointments.service'
import { AppointmentsController } from './appointments.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Appointment, AppointmentSchema } from './schemas/appointment.schema'
import { RecordsModule } from '../records/records.module'
import {
  TimeTemplate,
  TimeTemplateSchema,
} from './schemas/time-template.schema'
import { MailModule } from '../mail/mail.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
    MongooseModule.forFeature([
      { name: TimeTemplate.name, schema: TimeTemplateSchema },
    ]),
    forwardRef(() => RecordsModule),
    MailModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
