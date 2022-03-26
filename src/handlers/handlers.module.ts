import { Module } from '@nestjs/common'
import { CommonHandler } from './common.handler'

@Module({
  providers: [CommonHandler],
  exports: [CommonHandler],
})
export class HandlersModule {}
