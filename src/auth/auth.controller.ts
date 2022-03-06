import {
  Controller,
  Body,
  Post,
  Res,
  Req,
  Get,
  UseGuards,
} from '@nestjs/common'
import { DeleteResult } from 'mongodb'
import { Response } from 'express'
import { CreateUserDto } from './dto/create-user.dto'
import { AuthService } from './auth.service'
import { IUserData } from './interfaces/user-data.interface'
import { SignInUserDto } from './dto/sign-in-user.dto'
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard'
import { IRequestWithUser } from './interfaces/request-with-user'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { IRequestWithUserPayload } from './interfaces/request-with-user-payload.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('registration')
  async registration(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUserData> {
    const userData: IUserData = await this.authService.registration(
      createUserDto,
    )

    this.authService.setCookie(res, userData.refreshToken)

    return userData
  }

  @Post('login')
  async login(
    @Body() signInUserDto: SignInUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUserData> {
    const userData = await this.authService.login(signInUserDto)

    this.authService.setCookie(res, userData.refreshToken)

    return userData
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Req() req: IRequestWithUserPayload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<DeleteResult> {
    const token = await this.authService.logout(req.user.id)

    res.clearCookie('refreshToken')

    return token
  }

  @Get('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refresh(
    @Req() req: IRequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUserData> {
    const userData = await this.authService.refresh(req.user)

    this.authService.setCookie(res, userData.refreshToken)

    return userData
  }
}
