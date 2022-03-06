import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document

@Schema()
export class User {
  @Prop({ default: '' })
  photoUrl: string

  @Prop({ required: true })
  firstName: string

  @Prop({ required: true })
  lastName: string

  @Prop()
  patronymic: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ required: true })
  gender: string

  @Prop({ required: true })
  phoneNumber: string

  @Prop({ default: false })
  isActivated: boolean

  @Prop()
  activationLink: string
}

export const UserSchema = SchemaFactory.createForClass(User)
