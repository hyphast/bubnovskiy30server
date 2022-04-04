import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from './schemas/user.schema'
import { Model } from 'mongoose'
import { v4 } from 'uuid'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from '../auth/dto/create-user.dto'
import { SignInUserDto } from '../auth/dto/sign-in-user.dto'
import { BadRequestException } from '../exceptions/bad-request.exception'
import { CreateUserInterface } from '../auth/interfaces/create-user.interface'
import { IGetAllQueries } from '../handlers/interfaces/get-all-queries.interface'
import { CommonHandler } from '../handlers/common.handler'
import { IGetUsers } from './interfaces/get-users.interface'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly commonHandler: CommonHandler,
  ) {}

  async findUserByActivationLink(link: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ activationLink: link })
    return user
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email })
    return user
  }

  async findUserById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id)
    return user
  }

  async validateUser(signInUserDto: SignInUserDto): Promise<UserDocument> {
    const user = await this.getUserByEmail(signInUserDto.email)

    if (!user) {
      throw new BadRequestException('Пользователь с таким email не найден', [
        { email: 'Пользователь с таким email не найден' },
      ])
    }

    const isPasswordEquals = await bcrypt.compare(
      signInUserDto.password,
      user.password,
    )

    if (!isPasswordEquals) {
      throw new BadRequestException('Неверный пароль', [
        { password: 'Неверный пароль' },
      ])
    }

    return user
  }

  async createUser(createUserDto: CreateUserDto): Promise<CreateUserInterface> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12)
    const activationLink = v4()

    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      activationLink,
    })

    return { user, activationLink }
  }

  async getUsers(
    filter: IGetAllQueries['filter'],
    range: IGetAllQueries['range'],
    sort: IGetAllQueries['sort'],
  ): Promise<IGetUsers> {
    const match = this.commonHandler.handleFilter(filter)
    const sortBy = this.commonHandler.handleSort(sort)
    const { skip, lim } = this.commonHandler.handlePagination(range)

    const users = await this.userModel
      .find(match)
      .sort(sortBy)
      .limit(lim)
      .skip(skip)

    const countDocuments = await this.userModel.countDocuments({})

    return { users, countDocuments: countDocuments.toString() }
  }

  async getOneUser(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id)

    if (!user) { //TODO почему это не выполняется?
      new HttpException(
        'Такого пользователя не существует',
        HttpStatus.BAD_REQUEST,
      )
    }

    return user
  }
}
