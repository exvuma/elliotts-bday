import type { APIRoute } from 'astro'
import { getDbFromLocals } from '../../../lib/api/getDbFromLocals'
import {
  getAllLatestReservationRequests,
  table,
} from '../../../lib/db/reservation_requests'

export const GET: APIRoute = async ({ params, request, locals }) => {
  const db = getDbFromLocals(locals)
  const reservations = await getAllLatestReservationRequests(db)
  const csv =
    [
      table.columns.id,
      table.columns.name,
      table.columns.email,
      table.columns.additional_guests,
      table.columns.notes,
      table.columns.created_on,
    ].join(',') +
    '\n' +
    reservations
      .map((res) =>
        [
          res.id,
          res.name,
          res.email,
          res.additional_guests,
          res.notes,
          res.created_on,
        ].join(','),
      )
      .join('\n')

  return new Response(csv, { headers: { 'Content-Type': 'text/csv' } })
}
