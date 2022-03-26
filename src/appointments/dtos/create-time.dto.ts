import { IsDateString, IsDefined, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateTimeDto {
  @IsDefined({ message: 'Время не задано' })
  @IsString({ message: 'Должно быть строкой' })
  @IsDateString()
  @ApiProperty({
    example: '1970-01-01T08:30:00.000+00:00',
    description: 'Time',
  })
  readonly time: string
}
