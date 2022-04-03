import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
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
import { Record, RecordDocument } from './schemas/record.schema'
import { ResponseDto } from '../common/response.dto'

@ApiTags('Records')
@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}
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
    const recordId = query.id

    await this.recordsService.deleteRecord(req.user.id, recordId)

    return new ResponseDto(
      'Запись была удалена и перемещена в архив',
      'warning',
      '/records',
    )
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: Record })
  @ApiBearerAuth()
  async addRecord(@Body() addRecordDto: AddRecordDto): Promise<RecordDocument> {
    const recordData = await this.recordsService.addRecord(addRecordDto)
    return recordData
  }
}
