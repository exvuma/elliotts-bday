import type { APIRoute } from 'astro'
import { isReservation } from '../../../lib/api/reservations'
import { getDbFromLocals } from '../../../lib/api/getDbFromLocals'
import { createReservationRequest } from '../../../lib/db/reservation_requests'

export const POST: APIRoute = async ({ params, request, locals }) => {
  const body = await request.json()

  if (!isReservation(body)) {
    return new Response(
      JSON.stringify({
        error: 'invalid_reservation',
      }),
      {
        status: 400,
      },
    )
  }
  const db = getDbFromLocals(locals)
  const reservationRequest = await createReservationRequest(db, body)
  console.log('Created reservation request', reservationRequest)
  const expires = new Date()
  expires.setSeconds(60 * 60 * 24 * 100)

  return new Response('', {
    status: 204,
    headers: {
      'Set-Cookie': `email=${body.email}; Expires=${expires.toISOString()}; Path=/`,
    },
  })
}
