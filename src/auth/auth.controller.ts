import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { DeleteResult } from 'mongodb'
import { Response } from 'express'
import { CreateUserDto } from './dto/create-user.dto'
import { AuthService } from './auth.service'
import { SignInUserDto } from './dto/sign-in-user.dto'
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard'
import { IRequestWithUser } from './interfaces/request-with-user'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { IRequestWithUserPayload } from './interfaces/request-with-user-payload.dto'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { UserDataDto } from './dto/user-data.dto'
import { BadRequestException } from '../exceptions/bad-request.exception'

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('registration')
  @ApiOperation({ summary: 'Registration' })
  @ApiOkResponse({ type: UserDataDto })
  @ApiBadRequestResponse({ type: BadRequestException })
  async registration(
    @Res({ passthrough: true }) res: Response,
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserDataDto> {
    const userData: UserDataDto = await this.authService.registration(
      createUserDto,
    )

    this.authService.setCookie(res, userData.refreshToken)

    return userData
  }

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ type: UserDataDto })
  @ApiBadRequestResponse({ type: BadRequestException })
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() signInUserDto: SignInUserDto,
  ): Promise<UserDataDto> {
    const userData = await this.authService.login(signInUserDto)

    this.authService.setCookie(res, userData.refreshToken)

    return userData
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout' })
  @ApiOkResponse({ description: 'Object with deleteCount field' })
  @ApiUnauthorizedResponse({
    description: 'Object with statusCode: 401 and message: Unauthorized fields',
  })
  @ApiBearerAuth()
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
  @ApiOperation({ summary: 'Get refresh token' })
  @ApiOkResponse({ type: UserDataDto })
  @ApiUnauthorizedResponse({
    description: 'Object with statusCode: 401 and message: Unauthorized fields',
  })
  @ApiCookieAuth()
  async refresh(
    @Req() req: IRequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserDataDto> {
    const userData = await this.authService.refresh(req.user)

    this.authService.setCookie(res, userData.refreshToken)

    return userData
  }

  @Get('activate/:link')
  @ApiOperation({ summary: 'Activate user account' })
  @ApiOkResponse({ description: 'Redirect to client url' })
  @ApiBadRequestResponse({
    description:
      'Object with statusCode: 400 and message: Неккоректная ссылка активации fields',
  })
  async activate(
    @Res({ passthrough: true }) res: Response,
    @Param() params,
  ): Promise<void> {
    const activationLink = params.link
    await this.authService.activate(activationLink)
    return res.redirect(process.env.clientUrl)
  }
}
