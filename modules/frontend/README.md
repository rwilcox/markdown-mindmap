This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# Code Style

This React app intentionally plays with normal conventions, to test out new patterns.

## Intentionally splits view and model objects

... this was actually very helpful when moving to functional components, and then again to Next.js

It also allows us to test (theoretically test) business logic away from UI complexities.

## Use Fetch vs React-Query or alternatives

... in said model objects, ActiveRecord style

## display utilities

see src/utils/displayIfTrue.


## function keywords vs ES6 style function declarations

For readability, we're not using `this` so nothing to consider there.
