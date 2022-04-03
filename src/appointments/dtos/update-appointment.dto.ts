import { IsArray, IsDateString, IsDefined, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { AppointmentsCell } from '../schemas/appointments-cell.schema'

export class UpdateAppointmentDto {
  @IsDefined({ message: 'Appointments не заданы' })
  @IsArray()
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
