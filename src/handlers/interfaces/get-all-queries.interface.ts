export interface IGetAllQueries {
  sort: [string, string]
  range: [number, number]
  filter: { [key: string]: string }
}
