import { type D1Database } from '@cloudflare/workers-types'

export function getDbFromLocals(locals: App.Locals): D1Database {
  const db = locals.runtime.env.db

  if (typeof (db as any).prepare !== 'function') {
    throw new Error(
      'Invalid value on context.locals.runtime.env.db. Check your bindings in dash.',
    )
  }

  return db as D1Database
}
