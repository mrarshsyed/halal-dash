import { format,isValid } from 'date-fns'
export const formateDate = (date) => {
  if (!date || !isValid(date)) {
    return ''
  }
  console.log(date);

  
  return format(new Date(date), 'MMM dd, yyyy')
}
