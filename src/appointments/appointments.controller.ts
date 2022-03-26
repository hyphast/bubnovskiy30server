import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common'
import { AppointmentsService } from './appointments.service'
import { ParseQueriesPipe } from '../pipes/parse-queries.pipe'
import { IGetAllQueries } from '../handlers/interfaces/get-all-queries.interface'
import { Response } from 'express'
import { CreateTimeDto } from './dtos/create-time.dto'
import { Appointment, AppointmentDocument } from './schemas/appointment.schema'
import { UpdateAppointmentDto } from './dtos/update-appointment.dto'
import { UpdateResult } from 'mongodb'
import { IGetByDateQueries } from './interfaces/get-by-date-queries.interface'
import { TimeTemplateDocument } from './schemas/time-template.schema'

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  async getAppointments(
    @Res({ passthrough: true }) res: Response,
    @Query(new ParseQueriesPipe()) query: IGetAllQueries,
  ): Promise<AppointmentDocument[]> {
    const { filter, range, sort } = query

    const appointments = await this.appointmentsService.getAppointments(
      filter,
      range,
      sort,
    )

    res.set('Content-Range', '180') // 6 month

    return appointments
  }

  @Put()
  async updateOneAppointment(
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Param() params,
  ): Promise<UpdateResult> {
    const id: string = params.id

    //await recordService.addRecord(id, appointments, date) //TODO refactor!!!
    const appointment = await this.appointmentsService.updateOneAppointment(
      id,
      updateAppointmentDto,
    )

    return appointment
  }

  @Get('by-date')
  async getAppointmentByDate(
    @Query() query: IGetByDateQueries,
  ): Promise<AppointmentDocument | Appointment> {
    const date = query.date

    const appointments = await this.appointmentsService.getAppointmentByDate(
      date,
    )

    return appointments
  }

  @Get(':id')
  async getAppointmentById(@Param() params): Promise<AppointmentDocument> {
    const id: string = params.id

    const appointment = await this.appointmentsService.getAppointmentById(id)

    return appointment
  }

  @Post('time')
  async createTime(
    @Body() createTimeDto: CreateTimeDto,
  ): Promise<TimeTemplateDocument> {
    const timeData = await this.appointmentsService.createTime(createTimeDto)
    return timeData
  }
}
