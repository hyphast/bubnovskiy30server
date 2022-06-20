import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'
import { IGetAllQueries } from '../handlers/interfaces/get-all-queries.interface'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UpdateResult } from 'mongodb'
import { Appointment, AppointmentDocument } from './schemas/appointment.schema'
import {
  TimeTemplate,
  TimeTemplateDocument,
} from './schemas/time-template.schema'
import { IDateSearchRange } from './interfaces/date-search-range.interface'
import { CreateTimeDto } from './dtos/create-time.dto'
import { IHandleSort } from '../handlers/interfaces/handle-sort.interface'
import { AppointmentsCell } from './schemas/appointments-cell.schema'
import { UpdateAppointmentPatientsDto } from './dtos/update-appointment-patients.dto'
import { RecordsService } from '../records/records.service'
import { IDeletePatient } from './interfaces/delete-patient.interface'
import { AppointmentsType } from '../common/types/appointments-type.type'
import { RecordDocument } from '../records/schemas/record.schema'
import { MailService } from '../mail/mail.service'

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
    @InjectModel(TimeTemplate.name)
    private readonly timeTemplateModel: Model<TimeTemplateDocument>,
    @Inject(forwardRef(() => RecordsService))
    private readonly recordsService: RecordsService,
    private readonly mailService: MailService,
  ) {}

  async getAppointments(
    filter: IGetAllQueries['filter'],
    range: IGetAllQueries['range'],
    sort: IGetAllQueries['sort'],
  ): Promise<AppointmentDocument[]> {
    console.time('getAppointments router handler')

    const { start, end } = await this.handlePagination(range)

    const sortBy = this.handleSort(sort)

    const appointments: Array<AppointmentDocument> = await this.appointmentModel
      .find({ date: { $gte: start, $lt: end } })
      .sort(sortBy)
      .populate('appointments.patients.record')

    console.timeEnd('getAppointments router handler')

    return appointments
  }

  async getAppointmentById(id: string): Promise<AppointmentDocument> {
    const appointment = await this.appointmentModel
      .findById(id)
      .populate('appointments.patients.record')

    //Clean up deleted records
    // appointment.appointments.forEach((_, i) => {
    //   appointment.appointments[i].patients = appointment.appointments[
    //     i
    //   ].patients.filter((item) => item.record)
    // })
    appointment.numberAllPatients = this.calcNumberAllPatients(
      appointment.appointments,
    )
    await appointment.save()

    return appointment
  }

  async getAppointmentByDate(
    date: string,
  ): Promise<AppointmentDocument | Appointment> {
    const appointments = await this.appointmentModel.findOne({
      date: new Date(date),
    })

    if (!appointments) {
      const app = await this.initAppointments()
      const sortedApp = app.sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
      )

      return { date, appointments: sortedApp, numberAllPatients: 0 } //TODO ??
    }

    return appointments
  }

  async createAndAddUpcomingRecord(
    date: string,
    time: string,
    appointmentType: AppointmentsType,
    userId: string,
    status: string,
  ): Promise<RecordDocument> {
    const record = await this.recordsService.createRecord({
      date: date,
      time: time,
      appointmentType: appointmentType,
      userId: userId,
      status: status,
    })

    await this.recordsService.addUpcomingRecord({
      userId: userId,
      record: record._id,
    })

    return record
  }

  async createNewRecords(
    id: string,
    newAppointments: any, //TODO was UpdateAppointmentDto
    date: string,
  ): Promise<UpdateResult> {
    for (let i = 0; i < newAppointments.length; i++) {
      for (let j = 0; j < newAppointments[i].patients.length; j++) {
        const newRecord = newAppointments[i].patients[j].record
        if (newRecord._id) {
          const existingRecord = await this.recordsService.findRecord(
            newRecord._id,
          )

          if (
            String(existingRecord.userId) !== newRecord.userId ||
            new Date(existingRecord.time).getTime() !==
              new Date(newAppointments[i].time).getTime()
          ) {
            const record = await this.createAndAddUpcomingRecord(
              date,
              newAppointments[i].time,
              newRecord.appointmentType,
              newRecord.userId,
              'Администратор добавил запись',
            )

            newAppointments[i].patients[j].record = record._id
          } else if (
            existingRecord.appointmentType !== newRecord.appointmentType
          ) {
            existingRecord.appointmentType = newRecord.appointmentType
            existingRecord.status = 'Администратор изменил тип занятия'
            existingRecord.modifiedDate = new Date()
            await existingRecord.save()

            newAppointments[i].patients[j].record = existingRecord._id
          } else {
            newAppointments[i].patients[j].record = existingRecord._id
          }
        } else {
          const record = await this.createAndAddUpcomingRecord(
            date,
            newAppointments[i].time,
            newRecord.appointmentType,
            newRecord.userId,
            'В ожидании',
          )

          newAppointments[i].patients[j].record = record._id
        }
      }
    }

    const numberAllPatients = this.calcNumberAllPatients(newAppointments)

    const appointment = await this.appointmentModel.updateOne(
      { _id: id },
      { appointments: newAppointments, numberAllPatients },
    )

    return appointment
  }

  async deleteOldRecords(id, newAppointments) {
    const curAppointments = await this.getAppointmentById(id)
    const appointments: any = curAppointments.appointments //TODO any

    for (let i = 0; i < appointments.length; i++) {
      const sameNewAppointment = newAppointments.find(
        (item) =>
          new Date(item.time).getTime() ===
          new Date(appointments[i].time).getTime(),
      )

      for (let j = 0; j < appointments[i].patients.length; j++) {
        let patient: number
        if (sameNewAppointment) {
          patient = sameNewAppointment.patients.findIndex(
            (item) =>
              String(item.record.userId) ===
              String(appointments[i].patients[j].record.userId),
          )
        } else {
          patient = -1
        }

        if (patient === -1) {
          await this.recordsService.deleteRecord(
            String(appointments[i].patients[j].record.userId),
            String(appointments[i].patients[j].record._id),
            'Администратор отменил запись',
          )
        }
      }
    }
  }

  async updateAppointmentPatients(
    updateAppointmentPatients: UpdateAppointmentPatientsDto,
    email: string,
  ): Promise<AppointmentDocument> {
    let app = await this.appointmentModel.findOne({
      date: new Date(updateAppointmentPatients.date),
    })
    if (!app) {
      const appointments = await this.initAppointments()
      app = await this.appointmentModel.create({
        date: updateAppointmentPatients.date,
        appointments: appointments,
        numberAllPatients: 0,
      })
    }

    const appointment = app.appointments.find(
      (item) =>
        new Date(item.time).getTime() ===
        new Date(updateAppointmentPatients.time).getTime(),
    )

    const rec = await this.recordsService.createRecord({
      ...updateAppointmentPatients,
      status: 'В ожидании',
    })

    appointment.patients.splice(appointment.patients.length, 0, {
      record: rec._id,
    })

    app.numberAllPatients = this.calcNumberAllPatients(app.appointments)

    await this.recordsService.addUpcomingRecord({
      record: rec._id,
      userId: updateAppointmentPatients.userId,
    })

    // await this.mailService.sendSuccessMail(email, rec.date, rec.time)

    return app.save()
  }

  async deletePatient(
    deletePatient: IDeletePatient,
  ): Promise<AppointmentDocument> {
    //const range = this.dateSearchRange(updateAppointmentPatients.date)
    const app = await this.appointmentModel.findOne({
      date: new Date(deletePatient.date),
    })

    if (!app) {
      throw new BadRequestException('Ошибка сервера')
    }

    const appointmentIndex = app.appointments.findIndex((item) => {
      return (
        new Date(item.time).getTime() === new Date(deletePatient.time).getTime()
      )
    })

    const patientIndex = app.appointments[appointmentIndex].patients.findIndex(
      (item) => String(item.record) === deletePatient.record,
    )

    app.appointments[appointmentIndex].patients.splice(patientIndex, 1)

    app.numberAllPatients = this.calcNumberAllPatients(app.appointments)

    return app.save()
  }

  calcNumberAllPatients(appointments: Array<AppointmentsCell>): number {
    return appointments
      ? appointments.reduce(
          (acc, cur) =>
            cur?.patients?.length ? acc + cur.patients.length : acc,
          0,
        )
      : null
  }

  handleSort(sort: IGetAllQueries['sort']): IHandleSort {
    const sortBy: IHandleSort = {}
    if (sort) {
      sortBy[sort[0]] = sort[1] === 'DESC' ? -1 : 1
    }
    return sortBy
  }

  async handlePagination(
    range: IGetAllQueries['range'],
  ): Promise<IDateSearchRange> {
    const now = new Date()
    const date = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
    )
    const dateOffset = range[0]
    const amountOnePortion = range[1] - range[0] + 1
    const startDateTimestamp = date.setDate(date.getDate() + dateOffset)

    const { start, end } = this.dateSearchRange(
      startDateTimestamp,
      amountOnePortion,
    )

    const existingItemsArray: Array<AppointmentDocument> =
      await this.appointmentModel.find({
        date: { $gte: start, $lt: end },
      })

    const nonExistentItemsArray = await this.findNonExistentDocuments(
      existingItemsArray,
      startDateTimestamp,
      amountOnePortion,
    )

    await this.appointmentModel.insertMany(nonExistentItemsArray)

    return { start, end }
  }

  async findNonExistentDocuments(
    existingItemsArray: Array<AppointmentDocument>,
    startDateTimestamp: number,
    amountOnePortion: number,
  ): Promise<Appointment[]> {
    const nonExistentItemsArray: Array<Appointment> = []
    const curDate = new Date(startDateTimestamp)

    for (let i = 0; i < amountOnePortion; i++) {
      //const { start, end } = this.dateSearchRange(curDate)
      const suspectApp: AppointmentDocument | undefined =
        existingItemsArray.find((item) => {
          const itemDate = new Date(item.date)
          return itemDate.getTime() === curDate.getTime()
        })

      if (!suspectApp) {
        const apps = await this.initAppointments()

        const newApp: Appointment = {
          date: curDate.toISOString(),
          appointments: apps,
          numberAllPatients: 0,
        }

        nonExistentItemsArray.push(newApp)
      }

      curDate.setDate(curDate.getDate() + 1)
    }

    return nonExistentItemsArray
  }

  async initAppointments(): Promise<AppointmentsCell[]> {
    const time = await this.timeTemplateModel.find().sort({ time: 1 })

    const appointments: Array<AppointmentsCell> = time.map((i) => ({
      time: i.time,
      patients: [],
      maxNumberPatients: 12,
    }))

    return appointments
  }

  dateSearchRange(d: number | string, offset = 1): IDateSearchRange {
    const date = new Date(d)
    const start = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
    ).getTime()
    const end = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + offset),
    ).getTime()
    return { start, end }
  }

  async createTime(
    createTimeDto: CreateTimeDto,
  ): Promise<TimeTemplateDocument> {
    const time = createTimeDto.time

    const timeData = this.timeTemplateModel.create({ time })
    return timeData
  }
}
