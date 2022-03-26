type T = {
  $regex: string
  $options?: string
}

export interface IHandleFilter {
  firstName?: string | T
  lastName?: string | T
  patronymic?: string | T
  phoneNumber?: string | T
  _id?: string
}
