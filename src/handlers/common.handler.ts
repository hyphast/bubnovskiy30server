import { Injectable } from '@nestjs/common'
import { IGetAllQueries } from './interfaces/get-all-queries.interface'
import { IHandleFilter } from './interfaces/handle-filter.interface'
import { IHandleSort } from './interfaces/handle-sort.interface'
import { IHandlePagination } from './interfaces/handle-pagination.interface'

@Injectable()
export class CommonHandler {
  handleSort(sort: IGetAllQueries['sort']): IHandleSort {
    const sortBy: IHandleSort = {}
    if (sort) {
      sortBy[sort[0]] = sort[1] === 'DESC' ? -1 : 1
    }
    return sortBy
  }

  handlePagination(range: IGetAllQueries['range']): IHandlePagination {
    let skip: number, lim: number
    if (range) {
      skip = range[0]
      lim = range[1] - range[0] + 1
    }

    return { skip, lim }
  }

  handleFilter(filter: IGetAllQueries['filter']): IHandleFilter {
    const match: IHandleFilter = {}
    if (filter) {
      Object.keys(filter).forEach((item) => {
        if (item === 'id') return (match._id = filter[item])
        if (item === 'q') {
          const params = filter.q.split(' ')

          !!params[0] && (match.lastName = { $regex: params[0], $options: 'i' })
          !!params[1] &&
            (match.firstName = { $regex: params[1], $options: 'i' })
          !!params[2] &&
            (match.patronymic = { $regex: params[2], $options: 'i' })
          !!params[3] &&
            (match.phoneNumber = { $regex: params[3], $options: 'i' })

          return match
        }
        match[item] = filter[item]
      })
    }

    return match
  }
}
