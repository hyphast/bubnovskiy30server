import { AppointmentsCell } from '../schemas/appointment.schema'
import { IsDateString, IsDefined, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateAppointmentDto {
  @IsDefined({ message: 'Appointments не заданы' })
  @ApiProperty({
    example: AppointmentsCell,
    description: 'Appointment',
  })
  readonly appointments: Array<AppointmentsCell>

  @IsDefined({ message: 'Дата не задана' })
  @IsString({ message: 'Должно быть строкой' })
  @IsDateString()
  @ApiProperty({
    example: '2022-03-01T00:00:00.000+00:00',
    description: 'Date',
  })
  readonly date: string //TODO Is it right?
}
