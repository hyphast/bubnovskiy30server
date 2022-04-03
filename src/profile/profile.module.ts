import { Module } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { ProfileController } from './profile.controller'
import { UsersModule } from '../users/users.module'
import { FilesModule } from '../files/files.module'

@Module({
  imports: [UsersModule, FilesModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
