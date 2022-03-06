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
import { Response, Request } from 'express'
import { CreateUserDto } from './dto/create-user.dto'
import { AuthService } from './auth.service'
import { IUserData } from './interfaces/user-data.interface'
import { SignInUserDto } from './dto/sign-in-user.dto'
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard'

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
  ) {
    const userData = await this.authService.login(signInUserDto)

    this.authService.setCookie(res, userData.refreshToken)

    return userData
  }

  //TODO Does he need a useGuard decorator here?
  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<DeleteResult> {
    const { refreshToken } = req.cookies
    const token = await this.authService.logout(refreshToken)

    res.clearCookie('refreshToken')

    return token
  }

  @Get('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refresh(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUserData> {
    const { refreshToken } = req.cookies
    const userData = await this.authService.refresh(refreshToken, req.user)

    this.authService.setCookie(res, userData.refreshToken)

    return userData
  }
}
