import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Types } from 'mongoose'
import { Exclude } from 'class-transformer'
import { Document } from 'mongoose'

export type TokenDocument = Token & Document

@Schema()
export class Token {
  @Prop({ type: Types.ObjectId, ref: 'User' }) //TODO Is there required field ?
  @ApiProperty({ example: '6223f5fc14f2a789fa3bca83', description: 'User id' })
  user: Types.ObjectId

  @Prop({ required: true })
  @Exclude()
  @ApiProperty({
    example: '$2b$12$u9wHj21FhNtwCv6wvxpV1.5ClhbI31lRGybVemf5d0nfmxeZIvJLi',
    description: 'Hashed refresh token',
  })
  refreshToken: string
}
export const TokenSchema = SchemaFactory.createForClass(Token)
