/**

Meant to give a mapping of Java 8's Functional Types -> Typescript
 */

export type Runnable = () => void
export type Consumer<T> = (a: T) => void
export type Supplier<R> = () => R
export type Function<T, R> = (a: T) => R
