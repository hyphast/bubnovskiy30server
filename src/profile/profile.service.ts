import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { ProfileDto } from './dtos/profile.dto'
import { IGetUserProfilePayload } from './interfaces/get-user-profile-payload.interface'
import { UserDocument } from '../users/schemas/user.schema'
import { EditProfileInfoDto } from './dtos/edit-profile-info.dto'
import { FilesService } from '../files/files.service'

@Injectable()
export class ProfileService {
  constructor(
    private readonly usersService: UsersService,
    private readonly filesService: FilesService,
  ) {}
  async getUserProfile(id: string): Promise<IGetUserProfilePayload> {
    const profile = await this.usersService.findUserById(id)

    const profileDto = new ProfileDto(profile)

    return { profile: profileDto }
  }

  async editProfileInfo(
    id: string,
    editProfileInfoDto: EditProfileInfoDto,
  ): Promise<UserDocument> {
    const profile = await this.usersService.findUserById(id)

    profile.firstName = editProfileInfoDto.firstName
    profile.lastName = editProfileInfoDto.lastName
    profile.patronymic = editProfileInfoDto.patronymic
    profile.gender = editProfileInfoDto.gender
    profile.phoneNumber = editProfileInfoDto.phoneNumber

    return profile.save()
  }

  async savePhoto(
    id: string,
    image: Express.Multer.File,
  ): Promise<UserDocument> {
    const fileName = await this.filesService.createFile(image)
    const profile = await this.usersService.findUserById(id)
    profile.photoUrl = fileName

    return profile.save()
  }
}
