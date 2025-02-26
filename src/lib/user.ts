import cookie from 'cookie'

export interface User {
  email: string
}

export function getUser(): User | null {
  if (window.location.search.includes('email=')) {
    const search = new URLSearchParams(window.location.search)
    const email = search.get('email')

    if (!email || !isValidEmail(email)) {
      return null
    }

    return { email }
  }

  if (document.cookie.includes('email=')) {
    const cookies = cookie.parse(document.cookie)
    const email = cookies.email
    if (isValidEmail(email)) {
      return { email }
    }
  }

  return null
}

function isValidEmail(email: string) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
}
