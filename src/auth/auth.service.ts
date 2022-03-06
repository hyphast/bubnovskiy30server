import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { Types } from 'mongoose'
import { DeleteResult } from 'mongodb'
import { Response } from 'express'
import { CreateUserDto } from './dto/create-user.dto'
import { MailService } from '../mail/mail.service'
import { UsersService } from '../users/users.service'
import { BadRequestException } from '../exceptions/bad-request.exception'
import { SignInUserDto } from './dto/sign-in-user.dto'
import { UserDocument } from '../users/schemas/user.schema'
import { TokenService } from '../token/token.service'
import { UserDataDto } from './dto/user-data.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async registration(createUserDto: CreateUserDto): Promise<UserDataDto> {
    const candidate = await this.usersService.getUserByEmail(
      createUserDto.email,
    )

    if (candidate) {
      throw new BadRequestException(
        'Пользователь с таким Email уже существует',
        [{ email: 'Пользователь с таким Email уже существует' }],
      )
    }

    const { user, activationLink } = await this.usersService.createUser(
      createUserDto,
    )

    await this.mailService.sendActivationMail(
      user.email,
      `${process.env.apiUrl}/auth/activate/${activationLink}`,
    )

    const userData = await this.tokenService.setTokens(user)

    return userData
  }

  async login(signInUserDto: SignInUserDto): Promise<UserDataDto> {
    const user = await this.usersService.validateUser(signInUserDto)
    const userData = await this.tokenService.setTokens(user)

    return userData
  }

  async logout(id: Types.ObjectId): Promise<DeleteResult> {
    const token = await this.tokenService.removeToken(id)
    return token
  }

  async refresh(user: UserDocument): Promise<UserDataDto> {
    const userData = await this.tokenService.setTokens(user)
    return userData
  }

  async activate(link: string): Promise<void> {
    const user = await this.usersService.findUserByActivationLink(link)
    if (!user) {
      throw new BadRequestException('Неккоректная ссылка активации')
    }

    user.isActivated = true
    await user.save()
  }

  setCookie(res: Response, refreshToken): void {
    res.cookie('refreshToken', refreshToken, {
      maxAge: 2592000000,
      httpOnly: true,
    }) // maxAge: 30 days
  }

  async validateRefreshToken(
    refreshToken: string,
    id: Types.ObjectId,
  ): Promise<UserDocument> {
    const tokenFromDB = await this.tokenService.findToken(id)
    if (!tokenFromDB) {
      throw new UnauthorizedException()
    }

    const isTokensEquals = await bcrypt.compare(
      refreshToken,
      tokenFromDB.refreshToken,
    )

    if (!isTokensEquals) {
      throw new UnauthorizedException()
    }

    const user = await this.usersService.findById(id)

    return user
  }
}
