import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import {
  PersonalRecords,
  PersonalRecordsDocument,
} from './schemas/personal-records.schema'
import { Record, RecordDocument } from './schemas/record.schema'
import { RecordPayloadDto } from './dtos/record-payload.dto'
import { IGetUpcomingRecords } from './interfaces/get-upcoming-records.interface'
import { BadRequestException } from '../exceptions/bad-request.exception'
import { AppointmentsService } from '../appointments/appointments.service'
import { AddRecordDto } from './dtos/add-record.dto'
import { v4 } from 'uuid'
import { CreateRecordDto } from './dtos/create-record.dto'
import { IDeleteRecord } from './interfaces/delete-record.interface'
import { UsersService } from '../users/users.service'
import { UpdateResult } from 'mongodb'

@Injectable()
export class RecordsService {
  constructor(
    @InjectModel(PersonalRecords.name)
    private personalRecordsModel: Model<PersonalRecordsDocument>,
    @InjectModel(Record.name) private recordModel: Model<RecordDocument>,
    @Inject(forwardRef(() => AppointmentsService))
    private readonly appointmentsService: AppointmentsService,
    private readonly usersService: UsersService,
  ) {}
  async findRecord(id: string): Promise<RecordDocument> {
    const rec = await this.recordModel.findById(id)
    return rec
  }

  async findPersonalRecordsByUserId(
    id: string,
  ): Promise<PersonalRecordsDocument> {
    const recs = await this.personalRecordsModel.findOne({ user: id })
    return recs
  }

  async getRecords(id: string): Promise<IGetUpcomingRecords> {
    const recs = await this.findPersonalRecordsByUserId(id)

    if (!recs) {
      return {
        records: {
          upcomingRecords: [],
          finishedRecords: [],
          modifiedNumber: 0,
        },
      }
    }

    await recs.populate('upcomingRecords.record')
    await recs.populate('finishedRecords.record')

    const recordsDto = new RecordPayloadDto(recs)

    return { records: recordsDto }
  }

  async deleteRecord(
    userId: string,
    recId: string,
    status: string,
  ): Promise<IDeleteRecord> {
    const records = await this.findPersonalRecordsByUserId(userId)

    if (!records.upcomingRecords.length) {
      throw new BadRequestException('Такой записи не существует')
    }

    const index = records.upcomingRecords.findIndex(
      (item) => String(item.record) === recId,
    )

    if (index === -1) {
      throw new BadRequestException('Такой записи не существует')
    }

    const { record } = records.upcomingRecords[index]

    const rec = await this.findRecord(record)

    rec.status = status
    rec.modifiedDate = new Date()
    await rec.save()

    records.finishedRecords.splice(records.finishedRecords.length, 0, {
      record,
    })

    records.upcomingRecords.splice(index, 1)

    await records.save()

    return { rec, record }
  }

  async createRecord(createRecordDto: CreateRecordDto) {
    const rec = await this.recordModel.create({
      userId: createRecordDto.userId,
      date: createRecordDto.date,
      time: createRecordDto.time,
      appointmentType: createRecordDto.appointmentType,
      status: createRecordDto.status,
      modifiedDate: new Date(),
    })

    return rec
  }

  async incModifiedNumber(userId: string) {
    const userData = this.personalRecordsModel.updateOne(
      { user: userId },
      { $inc: { modifiedNumber: 1 } },
    )
    return userData
  }

  async addUpcomingRecord(
    addRecordDto: AddRecordDto,
  ): Promise<PersonalRecordsDocument> {
    let rec = await this.findPersonalRecordsByUserId(addRecordDto.userId)

    if (!rec) {
      rec = await this.personalRecordsModel.create({
        user: addRecordDto.userId,
        upcomingRecords: [],
        finishedRecords: [],
        modifiedNumber: 0,
      })
    }
    rec.upcomingRecords.splice(rec.upcomingRecords.length, 0, {
      record: addRecordDto.record,
    })

    const userData = await this.incModifiedNumber(addRecordDto.userId)

    return rec.save()
  }

  async resetModifiedNumber(userId: string): Promise<boolean> {
    const personalRecords = await this.findPersonalRecordsByUserId(userId)

    if (!personalRecords) {
      throw new BadRequestException('Не существует')
    }

    personalRecords.modifiedNumber = 0

    await personalRecords.save()

    return true
  }
}
