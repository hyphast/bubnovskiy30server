import { Module } from '@nestjs/common'
import { AppointmentsService } from './appointments.service'
import { AppointmentsController } from './appointments.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Appointment, AppointmentSchema } from './schemas/appointment.schema'
import {
  TimeTemplate,
  TimeTemplateSchema,
} from './schemas/time-template.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
    MongooseModule.forFeature([
      { name: TimeTemplate.name, schema: TimeTemplateSchema },
    ]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
