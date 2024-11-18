'use client'

import { Supplier } from './FunctionalTypes'


export function getSession(key: string): string {
  let localStore = null

  try {
    localStore = localStorage
  } catch {}

  const session: {[key: string]: Supplier<string>} = {
    TOKEN: ( () => localStore?.getItem("jwtToken") ?? ""),
    EMAIL: ( () => localStore?.getItem("email") ?? "")
  }

  return session[key]()
}

export function clearSession() {
 let localStore = null

  try {
    localStore = localStorage
  } catch {}

  localStore?.removeItem("jwtToken")
  localStore?.removeItem("email")
}

export function createSession(jwt?: string, email?: string) {
  let localStore = null

  try {
    localStore = localStorage
  } catch {}

  if (jwt && email) {
    localStore?.setItem('jwtToken', jwt)
    localStore?.setItem('email', email)
  }
}
