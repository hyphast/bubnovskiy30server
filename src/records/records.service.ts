import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { Record, RecordDocument } from './schemas/record.schema'
import { RecordPayloadDto } from './dtos/record-payload.dto'
import { IGetUpcomingRecords } from './interfaces/get-upcoming-records.interface'
import { BadRequestException } from '../exceptions/bad-request.exception'
import { AppointmentsService } from '../appointments/appointments.service'
import { AddRecordDto } from './dtos/add-record.dto'
import { v4 } from 'uuid'

@Injectable()
export class RecordsService {
  constructor(
    @InjectModel(Record.name) private recordModel: Model<RecordDocument>,
    @Inject(forwardRef(() => AppointmentsService))
    private readonly appointmentsService: AppointmentsService,
  ) {}
  async findRecordByUserId(id: string): Promise<RecordDocument> {
    const rec = await this.recordModel.findOne({ user: id })
    return rec
  }

  async getRecords(id: string): Promise<IGetUpcomingRecords> {
    const rec = await this.findRecordByUserId(id)

    if (!rec) {
      return { records: { upcomingRecords: [], finishedRecords: [] } }
    }

    const recordsDto = new RecordPayloadDto(rec)

    return { records: recordsDto }
  }

  async deleteRecord(
    userId: string,
    recordId: string,
  ): Promise<RecordDocument> {
    const rec = await this.findRecordByUserId(userId)

    if (!rec.upcomingRecords.length) {
      throw new BadRequestException('Такой записи не существует')
    }

    const index = rec.upcomingRecords.findIndex(
      (item) => String(item.appointmentId) === recordId,
    )

    if (index === -1) {
      throw new BadRequestException('Такой записи не существует')
    }

    const { date, time, appointmentType } = rec.upcomingRecords[index]
    await this.appointmentsService.deletePatient({
      date,
      time,
      appointmentType,
      userId,
    })

    rec.finishedRecords.splice(rec.finishedRecords.length, 0, {
      appointmentType: rec.upcomingRecords[index].appointmentType,
      time: rec.upcomingRecords[index].time,
      date: rec.upcomingRecords[index].date,
      appointmentId: rec.upcomingRecords[index].appointmentId,
      status: 'Услуга отменена',
    })

    rec.upcomingRecords.splice(index, 1)

    return rec.save()
  }

  async addRecord(addRecordDto: AddRecordDto): Promise<RecordDocument> {
    let rec = await this.findRecordByUserId(addRecordDto.userId)

    if (!rec) {
      rec = await this.recordModel.create({
        user: addRecordDto.userId,
        upcomingRecords: [],
        finishedRecords: [],
      })
    }

    rec.upcomingRecords.splice(rec.upcomingRecords.length, 0, {
      appointmentId: v4(),
      date: addRecordDto.date,
      time: addRecordDto.time,
      appointmentType: addRecordDto.appointmentType,
    })

    return rec.save()
  }
}
