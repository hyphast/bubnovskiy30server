import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import * as path from 'path'
import * as fs from 'fs'
import { v4 } from 'uuid'

@Injectable()
export class FilesService {
  async createFile(file): Promise<string> {
    try {
      const fileName = v4() + '.jpg'
      const filePath = path.resolve(__dirname, '..', 'static')

      fs.access(filePath, (err) => {
        fs.mkdir(filePath, { recursive: true }, (err) => {
          if (err) {
            throw new HttpException(
              `Ошибка записи файла: ${err}`,
              HttpStatus.INTERNAL_SERVER_ERROR,
            )
          }
        })
      })

      fs.writeFile(path.join(filePath, fileName), file.buffer, (err) => {
        if (err) {
          throw new HttpException(
            `Ошибка записи файла: ${err}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          )
        }
      })

      return fileName
    } catch (e) {
      throw new HttpException(
        'Ошибка записи файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
