import { format } from 'date-fns'
export const formateDate = (date) => {
  if (!date) {
    return ''
  }
  return format(new Date(date), 'MMM dd, yyyy')
}
