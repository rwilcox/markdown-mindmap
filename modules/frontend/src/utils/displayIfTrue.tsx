import * as R from 'ramda'

import { Function } from './FunctionalTypes'

/**

I dislike the following idiomatic React pattern:

{ someBoolean && <SomeComponent thing="foo"/> }

I have traditionally split "probably not full blown components yet" into
displaySomeComponent functions

function displaySomeComponent() {
  if (someBoolean) {
      return <SomeComponent thing="foo" />
  } else {
      return </>
  }
}

but that - especially using it like a closure, as we see here - means our
internal component is harder to test, AND harder to seperate out as it conflates itself with some internal state of the React component

So try this instead

1. Outside of the component, as a seperately exported function

export function displaySomeComponentImpl(deps) {
    return <SomeComponent thing="foo" />
}

2. In the component
const displaySomeComponent = displayIfTrue( displaySomeComponentImpl)

3. In your JSX

  { displaySomeComponent( {firstDep, secondDep}, shouldIShowThis) }
...

I am not yet sure if this is better, but this ability to continuously call displayIfTrue, each time adding the next parameter, is an interesting behavior of Ramda's curry behavior towards an easy builder pattern.

It certainly makes testing of these subcomponents easier, there's less seen if statements, and may allow easier extraction of parameters -> props if these components are needed to officially be components.

I've created displayIfTrue, which uses Ramda to manage the currying, and follows
that libraries currying behaviors. However, in doing so we lose type safety, and Typescript may complain at you. (or may not, depending on how complicated you're getting)

To save yourself some pain you probably want to use displayIfTrue, unless Typescript decides to hate you.

Typescript fully type compliant documentation below:

Take as given that type Function<T, R> = (parameter: T): R

If Typescript complains, I have three manually curried versions of this function:

 * displayIfTrue3<P>( Function<P, JSX.Element>, P, boolean): JSX.Element
     - takes all three parameters, when called it returns the appropriate JSX.Element
     - (this is technically the "not curried at all" version, it returns the appropriate JSX.Element)

 * displayIfTrue2<P>(Function<P, JSX.Element>, P): (boolean): JSX.Element
    - takes 2 parameters: the function and it's dependents, and returns a function you call later with _one_ parameter: a boolean.
    - Calling THAT function returns the appropriate JSX.Element

 * displayIfTrue1<P>(Function<P, JSX.Element>): (P, boolean): JSX>Element
   - takes 1 parameter: the function. Returns a function you'll call later with _two_ parameters: dependencies of type P
  and a boolean.
   - Calling THAT function returns the appropriate JSX.Element
 */

export function displayIfTrue3<DisplayFunctionParameterType>(
  fn: Function<DisplayFunctionParameterType, JSX.Element>,
  dependencies: DisplayFunctionParameterType,
  condition: boolean): JSX.Element {
    if (condition) { return fn(dependencies) } else { return <span></span> }
}


export function displayIfTrue2<DisplayFunctionParameterType>(
  fn: Function<DisplayFunctionParameterType, JSX.Element>,
  dependencies: DisplayFunctionParameterType) {
    return (condition: boolean) => displayIfTrue3<DisplayFunctionParameterType>(fn,dependencies, condition)
}


export function displayIfTrue1<DisplayFunctionParameterType>(
  fn: Function<DisplayFunctionParameterType, JSX.Element>) {
    return (dependencies: DisplayFunctionParameterType, condition: boolean) => displayIfTrue3<DisplayFunctionParameterType>(fn,
      dependencies, condition)
}


export const displayIfTrue = R.curry(displayIfTrue3)
