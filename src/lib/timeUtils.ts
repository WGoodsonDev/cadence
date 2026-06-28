export const minuteOfDay = (date: Date): number =>
  date.getHours() * 60 + date.getMinutes()

export const toDateString = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const toWeekKey = (date: Date): string => {
  // ISO 8601: week starts Monday; the Thursday of the week determines the year
  const d = new Date(date)
  const isoDay = d.getDay() || 7 // convert Sunday (0) to 7
  d.setDate(d.getDate() + 4 - isoDay) // shift to Thursday of this ISO week
  const year = d.getFullYear()
  const yearStart = new Date(year, 0, 1)
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${year}-W${String(week).padStart(2, '0')}`
}

export const formatMinute = (minute: number): string => {
  const hours = Math.floor(minute / 60)
  const mins = minute % 60
  const period = hours < 12 ? 'am' : 'pm'
  const displayHour = hours % 12 || 12
  return `${displayHour}:${String(mins).padStart(2, '0')}${period}`
}

export const minutesUntil = (currentMinute: number, endMinute: number): number =>
  endMinute - currentMinute
