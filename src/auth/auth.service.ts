import { Model, Types } from 'mongoose'
import { DeleteResult } from 'mongodb'
import { Response } from 'express'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from './dto/create-user.dto'
import { MailService } from '../mail/mail.service'
import { UsersService } from '../users/users.service'
import { BadRequestException } from '../exceptions/bad-request.exception'
import { JwtService } from '@nestjs/jwt'
import { Token, TokenDocument } from './schemas/token.schema'
import { IJWTTokens } from './interfaces/jwt-tokens.interface'
import { UserPayloadDto } from './dto/user-payload.dto'
import { IUserData } from './interfaces/user-data.interface'
import { SignInUserDto } from './dto/sign-in-user.dto'
import { User, UserDocument } from '../users/schemas/user.schema'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registration(createUserDto: CreateUserDto): Promise<IUserData> {
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

    // await this.mailService.sendActivationMail(
    //   registerUserDto.email,
    //   `${process.env.apiUrl}/api/auth/activate/${activationLink}`, //TODO Доделать
    // )

    const userData = await this.setTokens(user)

    return userData
  }

  async login(signInUserDto: SignInUserDto): Promise<IUserData> {
    const user = await this.usersService.validateUser(signInUserDto)
    const userData = await this.setTokens(user)

    return userData
  }

  async logout(refreshToken: string): Promise<DeleteResult> {
    const token = await this.removeToken(refreshToken)
    return token
  }

  async refresh(refreshToken: string, user: UserDocument): Promise<IUserData> {
    const userData = await this.setTokens(user)

    return userData
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
    const tokenFromDB = await this.findToken(id)
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

  async findToken(id: Types.ObjectId): Promise<TokenDocument> {
    const tokenData = await this.tokenModel.findOne({ user: id })
    return tokenData
  }

  async removeToken(refreshToken: string): Promise<DeleteResult> {
    const tokenData = await this.tokenModel.deleteOne({ refreshToken })
    return tokenData
  }

  async setTokens(user: UserDocument): Promise<IUserData> {
    const userPayloadDto = new UserPayloadDto(user)
    const tokens = await this.generateToken(userPayloadDto)
    await this.saveToken(tokens.refreshToken, userPayloadDto.id)

    return { ...tokens, user: userPayloadDto }
  }

  private async generateToken(user: UserPayloadDto): Promise<IJWTTokens> {
    const payload = { ...user }

    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '15s', //TODO 25m
        secret: process.env.jwtAccessSecret,
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '30s', //TODO 15d
        secret: process.env.jwtRefreshSecret,
      }),
    }
  }

  private async saveToken(
    refreshToken: string,
    userId: Types.ObjectId,
  ): Promise<TokenDocument> {
    const tokenData = await this.tokenModel.findOne({ user: userId })
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 12)
    if (tokenData) {
      tokenData.refreshToken = hashedRefreshToken
      return tokenData.save()
    }

    const token = await this.tokenModel.create({
      user: userId,
      refreshToken: hashedRefreshToken,
    })
    return token
  }
}
