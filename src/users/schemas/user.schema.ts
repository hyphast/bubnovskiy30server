import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document } from 'mongoose'

export type UserDocument = User & Document

@Schema()
export class User {
  @Prop({ default: '' })
  @ApiProperty({
    example:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAYAAAA+s9J6AAAAAXNSR0IArs4c6QAAEiVJREFUeF7tn/OECEdhg90S/',
    description: 'User photo',
  })
  photoUrl?: string

  @Prop({ required: true })
  @ApiProperty({ example: 'Иван', description: 'First name' })
  firstName: string

  @Prop({ required: true })
  @ApiProperty({ example: 'Иванов', description: 'Last name' })
  lastName: string

  @Prop()
  @ApiProperty({ example: 'Иванович', description: 'Patronymic' })
  patronymic: string

  @Prop({ required: true, unique: true })
  @ApiProperty({ example: 'email@gmail.com', description: 'Email address' })
  email: string

  @Prop({ required: true })
  @ApiProperty({
    example: '$2a$12$yXAepwvUqx3QYgahrwIaoulwtrvnHg2HZk0T5sjs/Oje90ByjSzxs',
    description: 'Password',
  })
  password: string

  @Prop({ required: true })
  @ApiProperty({ example: 'male', description: 'Gender' })
  gender: string

  @Prop({ required: true })
  @ApiProperty({ example: '+79213441126', description: 'Phone number' })
  phoneNumber: string

  @Prop({ default: false })
  @ApiProperty({ example: 'true', description: 'Is account activated' })
  isActivated: boolean

  @Prop()
  @ApiProperty({
    example: '3d5e2305-4e17-41ef-97b6-1cb1587a4c0d',
    description: 'Account activation link',
  })
  activationLink: string
}

export const UserSchema = SchemaFactory.createForClass(User)
