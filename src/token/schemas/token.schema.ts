import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { Exclude } from 'class-transformer'
import { Document } from 'mongoose'

export type TokenDocument = Token & Document

@Schema()
export class Token {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string

  @Prop({ required: true })
  @Exclude()
  refreshToken: string
}
export const TokenSchema = SchemaFactory.createForClass(Token)
