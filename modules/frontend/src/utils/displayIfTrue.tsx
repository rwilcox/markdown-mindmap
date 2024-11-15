import * as R from 'ramda'

export function displayIfTrueImpl(fn, dependencies, condition) {
  if (condition) { return fn(dependencies) } else { return <span></span> }
}

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
 */
export const displayIfTrue = R.curry(displayIfTrueImpl)
