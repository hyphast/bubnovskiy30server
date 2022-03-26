import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class ParseQueriesPipe implements PipeTransform {
  transform(value: any, { type }: ArgumentMetadata) {
    if (type === 'query') return this.transformQueries(value)

    return value
  }

  transformQueries(value: any) {
    const queries: any = {}
    Object.keys(value).forEach(
      (key: string) => (queries[key] = JSON.parse(value[key])),
    )

    return queries
  }
}
