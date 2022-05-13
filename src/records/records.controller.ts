import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { IRequestWithUserPayload } from '../auth/interfaces/request-with-user-payload.dto'
import { RecordsService } from './records.service'
import { IGetUpcomingRecords } from './interfaces/get-upcoming-records.interface'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { AddRecordDto } from './dtos/add-record.dto'
import {
  PersonalRecords,
  PersonalRecordsDocument,
} from './schemas/personal-records.schema'
import { ResponseDto } from '../common/response.dto'
import { AppointmentsService } from '../appointments/appointments.service'

@ApiTags('Records')
@Controller('records')
export class RecordsController {
  constructor(
    private readonly recordsService: RecordsService,
    private readonly appointmentsService: AppointmentsService,
  ) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  //@ApiOkResponse({ type: Record })
  @ApiBearerAuth()
  async getRecords(
    @Req() req: IRequestWithUserPayload,
  ): Promise<IGetUpcomingRecords> {
    const records = await this.recordsService.getRecords(req.user.id)
    return records
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  // @ApiOkResponse({ type: Record })
  @ApiBearerAuth()
  async deleteRecord(
    @Req() req: IRequestWithUserPayload,
    @Query() query: { id: string },
  ): Promise<ResponseDto> {
    const recId = query.id

    const { rec, record } = await this.recordsService.deleteRecord(
      req.user.id,
      recId,
      'Услуга отменена',
    )
    await this.appointmentsService.deletePatient({
      date: rec.date,
      time: rec.time,
      appointmentType: rec.appointmentType,
      record,
    })

    return new ResponseDto(
      'Запись была удалена и перемещена в архив',
      'warning',
      '/records',
    )
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: PersonalRecords })
  @ApiBearerAuth()
  async addUpcomingRecord(
    @Body() addRecordDto: AddRecordDto,
  ): Promise<PersonalRecordsDocument> {
    const recordData = await this.recordsService.addUpcomingRecord(addRecordDto)
    return recordData
  }

  @Put('modified-number')
  @UseGuards(JwtAuthGuard)
  // @ApiOkResponse({ type: PersonalRecords })
  @ApiBearerAuth()
  async resetModifiedNumber(
    @Req() req: IRequestWithUserPayload,
  ): Promise<boolean> {
    const recordsData = await this.recordsService.resetModifiedNumber(
      req.user.id,
    )
    return recordsData
  }
}
