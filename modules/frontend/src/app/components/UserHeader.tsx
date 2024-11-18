'use client'

import { displayIfTrue2 } from '@/utils/displayIfTrue'
import { Runnable } from '@/utils/FunctionalTypes'

export type SigninInfo = {
  email: string;
  jwt?: string;
}

type UserHeaderCallbackProps = {
  handleSignout: () => void
}

export type UserHeaderProps = SigninInfo & UserHeaderCallbackProps

type HeaderParameters = { email: string, handleSignout: Runnable }
export function UserHeaderImpl({email, handleSignout}: HeaderParameters) {
  return (<div>
            {email && <p>Welcome, {email}</p>}
            <button className="nativeBtn" type="button" onClick={handleSignout}>Sign Out</button>
          </div>
  )
}

export function UserHeader(props: UserHeaderProps): JSX.Element {
  const f = displayIfTrue2<HeaderParameters>(UserHeaderImpl, {email: props.email, handleSignout: props.handleSignout})

  return ( f(props.jwt != "")  )
}
