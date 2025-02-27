import type { D1Database } from '@cloudflare/workers-types'
import type { Reservation } from '../api/reservations'
import { getTable } from './table'

export const table = getTable({
  name: 'reservation_requests',
  columns: ['id', 'email', 'name', 'additional_guests', 'notes', 'created_on'],
} as const)

interface DBReservationRequest extends Reservation {
  id: number
  created_on: Date
}

export async function createReservationRequest(
  db: D1Database,
  reservation: Reservation,
): Promise<DBReservationRequest> {
  const res = await db
    .prepare(
      /* sql */ `
insert into "${table.name}" (
  "${table.columns.email}",
  "${table.columns.name}",
  "${table.columns.notes}",
  "${table.columns.additional_guests}"
) values (?, ?, ?, ?)
returning *
  `.trim(),
    )
    .bind(
      reservation.email,
      reservation.name,
      reservation.notes,
      reservation.additional_guests,
    )
    .run()

  return getReservationRequestFromD1Record(res.results[0])
}

export async function getLatestReservationRequestForEmail(
  db: D1Database,
  email: string,
): Promise<DBReservationRequest | null> {
  const {
    results: [result],
  } = await db
    .prepare(
      /* sql */ `
select
  "${table.columns.id}",
  "${table.columns.email}",
  "${table.columns.name}",
  "${table.columns.additional_guests}",
  "${table.columns.notes}",
  "${table.columns.created_on}"
from "${table.name}"
where "${table.columns.email}" = ?
order by "${table.columns.created_on}" desc
limit 1
  `.trim(),
    )
    .bind(email)
    .run()

  if (!result) {
    return null
  }

  return getReservationRequestFromD1Record(result)
}

function getReservationRequestFromD1Record(
  record: Record<string, unknown>,
): DBReservationRequest {
  if (!record) {
    throw new Error('No records found.')
  }

  const id = record.id
  const name = record.name
  const notes = record.notes
  const email = record.email
  const additional_guests = record.additional_guests
  const created_on = record.created_on

  if (typeof id !== 'number') {
    throw new Error('Missing `id` from result set.')
  }

  if (typeof name !== 'string') {
    throw new Error('Missing `name` from result set.')
  }

  if (typeof email !== 'string') {
    throw new Error('Missing `email` from result set.')
  }

  if (typeof notes !== 'string') {
    throw new Error('Missing `notes` from result set.')
  }

  if (typeof additional_guests !== 'number') {
    throw new Error('Missing `additional_guests` from result set.')
  }

  if (typeof created_on !== 'string') {
    throw new Error('Missing `created_on` from result set.')
  }

  return {
    id,
    name,
    notes,
    email,
    additional_guests,
    created_on: new Date(created_on),
  }
}

export function getReservationFromReservationRequest(
  reservationRequest: DBReservationRequest,
): Reservation {
  return {
    additional_guests: reservationRequest.additional_guests,
    email: reservationRequest.email,
    name: reservationRequest.name,
    notes: reservationRequest.notes,
  }
}

export async function getAllLatestReservationRequests(
  db: D1Database,
): Promise<DBReservationRequest[]> {
  const { results } = await db
    .prepare(
      /* sql */ `
select
  "${table.columns.id}",
  "${table.columns.email}",
  "${table.columns.name}",
  "${table.columns.additional_guests}",
  "${table.columns.notes}",
  "${table.columns.created_on}"
from "${table.name}"
group by "${table.columns.email}"
order by "${table.columns.created_on}" desc
  `.trim(),
    )
    .run()

  return results.map(getReservationRequestFromD1Record)
}
