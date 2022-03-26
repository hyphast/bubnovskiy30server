import { Injectable } from '@nestjs/common'
import { IGetAllQueries } from '../handlers/interfaces/get-all-queries.interface'
import { InjectModel } from '@nestjs/mongoose'
import { v4 } from 'uuid'
import { Model } from 'mongoose'
import { UpdateResult } from 'mongodb'
import {
  Appointment,
  AppointmentDocument,
  AppointmentsCell,
} from './schemas/appointment.schema'
import {
  TimeTemplate,
  TimeTemplateDocument,
} from './schemas/time-template.schema'
import { IDateSearchRange } from './interfaces/date-search-range.interface'
import { CreateTimeDto } from './dtos/create-time.dto'
import { UpdateAppointmentDto } from './dtos/update-appointment.dto'
import { IHandleSort } from '../handlers/interfaces/handle-sort.interface'

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(TimeTemplate.name)
    private timeTemplateModel: Model<TimeTemplateDocument>,
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

    //const appsWithId = this.withIdField(appointments) //TODO Do it in the Data Provider

    console.timeEnd('getAppointments router handler')

    return appointments
  }

  async getAppointmentById(id: string): Promise<AppointmentDocument> {
    const appointment = await this.appointmentModel.findById(id)

    // const appointmentWithId = { id: appointment._id, ...appointment._doc } //TODO Do it in the Data Provider
    //
    // appointment.appointments = appointmentWithId.appointments.map((app) => ({ //TODO Do it in the Data Provider
    //   id: app._id,
    //   ...app._doc,
    // }))
    //
    // appointment.appointments.forEach((app) => { //TODO Do it in the Data Provider
    //   app.treatment = app.patients.filter(
    //     (item) => item.appointmentType === 'Лечебные занятия',
    //   )
    //   app.physicalTraining = app.patients.filter(
    //     (item) =>
    //       item.appointmentType === 'Физкультурно-оздоровительные занятия',
    //   )
    // })

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
        appointments[i].patients[j] = Object.assign( //TODO Is it right?
          { appointmentId: v4() },
          pat,
        )
      }),
    ) //todo дублирование?

    const appointment = await this.appointmentModel.updateOne(
      { _id: id },
      { appointments: appointments, numberAllPatients },
    )

    //appointment['date'] = date //TODO Do it in the Data Provider
    //appointment['id'] = id

    return appointment
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

  // withIdField(items) { //TODO remove it
  //   if (Array.isArray(items)) {
  //     const itemsList: Array<Appointment> = items.map((i) => ({
  //       id: i._id,
  //       ...i._doc,
  //     }))
  //
  //     return itemsList
  //   } else {
  //     const itemsList = { id: items._id, ...items._doc }
  //
  //     return itemsList
  //   }
  // }

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
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    ) // TODO Is it correct??
    const dateOffset = range[0]
    const amountOnePortion = range[1] - range[0] + 1
    const startDateTimestamp = date.setUTCDate(date.getUTCDate() + dateOffset) // TODO Is it correct??

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

  dateSearchRange(
    dateTimestamp: number | string,
    offset = 1,
  ): IDateSearchRange {
    const date = new Date(dateTimestamp)
    const start = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    ).getTime()

    const end = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + offset,
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