import { AppointmentsType } from '../../common/types/appointments-type.type'

export interface IDeletePatient {
  date: string
  time: string
  appointmentType: AppointmentsType
  record: string
}
