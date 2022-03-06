import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from './pipes/validation.pipe'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe())

  const PORT = parseInt(process.env.port) || 3000
  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
}
bootstrap()