import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { User } from './schemas/user.schema'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: User })
  @ApiBearerAuth()
  getUsers(@Req() req): string {
    return req.user
  }
}
