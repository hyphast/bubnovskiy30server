import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { User, UserDocument } from './schemas/user.schema'
import { Response } from 'express'
import { ParseQueriesPipe } from '../pipes/parse-queries.pipe'
import { IGetAllQueries } from '../handlers/interfaces/get-all-queries.interface'
import { UsersService } from './users.service'
import { IGetUsers } from './interfaces/get-users.interface'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  //@UseGuards(JwtAuthGuard) //TODO Make auth
  @ApiOkResponse({ type: User })
  //@ApiBearerAuth() //TODO Make auth
  async getUsers(
    @Res({ passthrough: true }) res: Response,
    @Query(new ParseQueriesPipe()) query: IGetAllQueries,
  ): Promise<UserDocument[]> {
    const { filter, range, sort } = query

    const users = await this.usersService.getUsers(filter, range, sort)

    res.set('Content-Range', users.countDocuments)

    return users.users
  }

  @Get(':id')
  //@UseGuards(JwtAuthGuard) //TODO Make auth
  @ApiOkResponse({ type: User })
  //@ApiBearerAuth() //TODO Make auth
  async getOneUser(@Param() params): Promise<UserDocument> {
    const id = params.id

    const user = await this.usersService.getOneUser(id)

    return user
  }
}
