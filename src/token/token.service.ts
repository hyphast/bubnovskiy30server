import { Injectable } from '@nestjs/common'
import { Model, Types } from 'mongoose'
import { UserDocument } from '../users/schemas/user.schema'
import * as bcrypt from 'bcrypt'
import { DeleteResult } from 'mongodb'
import { UserPayloadDto } from '../auth/dto/user-payload.dto'
import { IJWTTokens } from '../auth/interfaces/jwt-tokens.interface'
import { InjectModel } from '@nestjs/mongoose'
import { Token, TokenDocument } from './schemas/token.schema'
import { JwtService } from '@nestjs/jwt'
import { UserDataDto } from '../auth/dto/user-data.dto'

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    private jwtService: JwtService,
  ) {}

  async findToken(id: Types.ObjectId): Promise<TokenDocument> {
    const tokenData = await this.tokenModel.findOne({ user: id })
    return tokenData
  }

  async removeToken(id: Types.ObjectId): Promise<DeleteResult> {
    const tokenData = await this.tokenModel.deleteOne({ user: id })
    return tokenData
  }

  async setTokens(user: UserDocument): Promise<UserDataDto> {
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
