import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ProfileService } from './profile.service'
import { IRequestWithUserPayload } from '../auth/interfaces/request-with-user-payload.dto'
import { IGetUserProfilePayload } from './interfaces/get-user-profile-payload.interface'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ResponseDto } from '../common/response.dto'
import { EditProfileInfoDto } from './dtos/edit-profile-info.dto'
import { FileInterceptor } from '@nestjs/platform-express'

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  //@ApiOkResponse({ type: Record }) //TODO доделать все похожие
  @ApiBearerAuth()
  async getUserProfile(
    @Req() req: IRequestWithUserPayload,
  ): Promise<IGetUserProfilePayload> {
    const profile = await this.profileService.getUserProfile(req.user.id)
    return profile
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  //@ApiOkResponse({ type: Record })
  @ApiBearerAuth()
  async editProfileInfo(
    @Req() req: IRequestWithUserPayload,
    @Body() editProfileInfoDto: EditProfileInfoDto,
  ): Promise<ResponseDto> {
    await this.profileService.editProfileInfo(req.user.id, editProfileInfoDto)

    return new ResponseDto(
      'Основная информация профиля была изменена',
      'info',
      '/profile',
    )
  }

  @Put('photo')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthGuard)
  //@ApiOkResponse({ type: Record })
  @ApiBearerAuth()
  async savePhoto(
    @Req() req: IRequestWithUserPayload,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<ResponseDto> {
    await this.profileService.savePhoto(req.user.id, image)

    return new ResponseDto('Фото было обновлено', 'info', '/profile')
  }
}
