import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'
import { IGetAllQueries } from '../handlers/interfaces/get-all-queries.interface'
import { InjectModel } from '@nestjs/mongoose'
import { v4 } from 'uuid'
import { Model } from 'mongoose'
import { UpdateResult } from 'mongodb'
import { Appointment, AppointmentDocument } from './schemas/appointment.schema'
import {
  TimeTemplate,
  TimeTemplateDocument,
} from './schemas/time-template.schema'
import { IDateSearchRange } from './interfaces/date-search-range.interface'
import { CreateTimeDto } from './dtos/create-time.dto'
import { UpdateAppointmentDto } from './dtos/update-appointment.dto'
import { IHandleSort } from '../handlers/interfaces/handle-sort.interface'
import { AppointmentsCell } from './schemas/appointments-cell.schema'
import { UpdateAppointmentPatientsDto } from './dtos/update-appointment-patients.dto'
import { RecordsService } from '../records/records.service'

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
    @InjectModel(TimeTemplate.name)
    private readonly timeTemplateModel: Model<TimeTemplateDocument>,
    @Inject(forwardRef(() => RecordsService))
    private readonly recordsService: RecordsService,
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

    console.timeEnd('getAppointments router handler')

    return appointments
  }

  async getAppointmentById(id: string): Promise<AppointmentDocument> {
    const appointment = await this.appointmentModel.findById(id)
    return appointment
  }

  async getAppointmentByDate(
    date: string,
  ): Promise<AppointmentDocument | Appointment> {
    //const { start, end } = this.dateSearchRange(date)

    const appointments = await this.appointmentModel.findOne({
      date: new Date(date),
    })

    if (!appointments) {
      const app = await this.initAppointments()
      const sortedApp = app.sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
      ) //TODO modified

      return { date, appointments: sortedApp, numberAllPatients: 0 } //TODO ??
    }

    return appointments
  }

  async updateOneAppointment(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<UpdateResult> {
    // appointment = appointment.map(item => item.patients.map(i => i.numberPatients + 1))
    const { appointments } = updateAppointmentDto
    const numberAllPatients = this.calcNumberAllPatients(appointments)

    appointments.forEach((_, i) =>
      appointments[i].patients.forEach((pat, j) => {
        appointments[i].patients[j] = Object.assign(
          //TODO Is it right?
          { appointmentId: v4() },
          pat,
        )
      }),
    ) //todo дублирование?

    const appointment = await this.appointmentModel.updateOne(
      { _id: id },
      { appointments: appointments, numberAllPatients },
    )

    return appointment
  }

  async updateAppointmentPatients(
    updateAppointmentPatients: UpdateAppointmentPatientsDto,
  ): Promise<AppointmentDocument> {
    //const range = this.dateSearchRange(updateAppointmentPatients.date)
    let app = await this.appointmentModel.findOne({
      date: new Date(updateAppointmentPatients.date), //TODO was: date: { $gte: range.start, $lt: range.end },
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

    appointment.patients.splice(appointment.patients.length, 0, {
      appointmentId: v4(),
      userId: updateAppointmentPatients.userId,
      appointmentType: updateAppointmentPatients.appointmentType,
    })

    app.numberAllPatients = this.calcNumberAllPatients(app.appointments)

    await this.recordsService.addRecord(updateAppointmentPatients)

    return app.save()
  }

  async deletePatient(
    updateAppointmentPatients: UpdateAppointmentPatientsDto,
  ): Promise<AppointmentDocument> {
    //const range = this.dateSearchRange(updateAppointmentPatients.date)
    const app = await this.appointmentModel.findOne({
      date: new Date(updateAppointmentPatients.date), //TODO was: date: { $gte: range.start, $lt: range.end },
    })

    if (!app) {
      throw new BadRequestException('Ошибка сервера')
    }

    const appointmentIndex = app.appointments.findIndex(
      (item) =>
        new Date(item.time).getTime() ===
        new Date(updateAppointmentPatients.time).getTime(),
    )

    const patientIndex = app.appointments[appointmentIndex].patients.findIndex(
      (item) => String(item.userId) === updateAppointmentPatients.userId,
    )

    app.appointments[appointmentIndex].patients.splice(patientIndex, 1)

    app.numberAllPatients = this.calcNumberAllPatients(app.appointments)

    return app.save()
  }

  calcNumberAllPatients(appointments: Array<AppointmentsCell>): number {
    return appointments
      ? appointments.reduce(
          (acc, cur) =>
            cur?.patients?.length ? acc + cur.patients.length : acc, //TODO acc + 0?
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
    const startDateTimestamp = date.setDate(date.getDate() + dateOffset) // TODO was: const startDateTimestamp = date.setUTCDate(date.getUTCDate() + dateOffset)

    const { start, end } = this.dateSearchRange(
      startDateTimestamp,
      amountOnePortion,
    )

    const existingItemsArray: Array<AppointmentDocument> =
      await this.appointmentModel.find({
        date: { $gte: start, $lt: end }, //TODO was: date: { $gte: start, $lt: end },
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
    const nonExistentItemsArray: Array<Appointment> = [] //TODO Look for array type
    const curDate = new Date(startDateTimestamp)

    for (let i = 0; i < amountOnePortion; i++) {
      //const { start, end } = this.dateSearchRange(curDate)
      const suspectApp: AppointmentDocument | undefined =
        existingItemsArray.find((item) => {
          const itemDate = new Date(item.date) //TODO Was: item.date.getTime()
          return itemDate.getTime() === curDate.getTime() // TODO Was: return itemDate >= start && itemDate <= end
        })

      if (!suspectApp) {
        const apps = await this.initAppointments()

        const newApp: Appointment = {
          date: curDate.toISOString(), //TODO There was: date: curDate.toISOString(),
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
