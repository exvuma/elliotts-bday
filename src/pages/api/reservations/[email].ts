import type { APIRoute } from 'astro'
import { getDbFromLocals } from '../../../lib/api/getDbFromLocals'
import {
  getLatestReservationRequestForEmail,
  getReservationFromReservationRequest,
} from '../../../lib/db/reservation_requests'

export const GET: APIRoute = async ({ params, request, locals }) => {
  const { email } = params

  if (!email) {
    return new Response(JSON.stringify({ error: 'missing_email' }), { status: 400 })
  }

  const db = getDbFromLocals(locals)
  const reservationRequest = await getLatestReservationRequestForEmail(db, email)

  if (!reservationRequest) {
    return new Response('', { status: 404 })
  }

  return new Response(
    JSON.stringify(getReservationFromReservationRequest(reservationRequest)),
  )
}
