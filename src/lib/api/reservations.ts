export interface Reservation {
  name: string
  email: string
  notes: string
  additional_guests: number
}

export function isReservation(data: any): data is Reservation {
  if (!data) {
    return false
  }

  const maybeReservation: Reservation = data

  return (
    typeof maybeReservation.name === 'string' &&
    typeof maybeReservation.email === 'string' &&
    typeof maybeReservation.additional_guests === 'number'
  )
}

export async function createReservation(reservation: Reservation) {
  const res = await fetch('/api/reservations', {
    method: 'POST',
    body: JSON.stringify(reservation),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error('Error creating reservation', body)
    throw new Error('Error creating reservation: ' + body)
  }
}

export async function getReservation(email: string): Promise<Reservation | null> {
  const res = await fetch('/api/reservations/' + encodeURIComponent(email))

  if (res.status === 404) {
    return null
  }

  if (!res.ok) {
    throw new Error('Error creating reservation: ' + (await res.text()))
  }

  const data = await res.json()

  if (!isReservation(data)) {
    throw new Error('Invalid data from API')
  }

  return data
}
