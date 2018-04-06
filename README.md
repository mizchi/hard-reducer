# hard-reducer

[![CircleCI](https://circleci.com/gh/mizchi/hard-reducer.svg?style=svg)](https://circleci.com/gh/mizchi/hard-reducer)

Type friendly facade for better reducer.

```sh
npm install hard-reducer -S
# or
yarn add hard-reducer
```

## Concepts

* Type safe interface
* Avoid redundant `type` string definitions
* Keep reducer interface `(State, Action) => State` to use with `redux.combineReducers()`
* Handle Flux Standard Action `<Payload>{ type: string, payload: Payload }`

Check this code to know detail.

[Flow playground](https://flow.org/try/#0PQKgBAAgZgNg9gdzCYAoUYCmBnGBLAOwBcBaAEz2wEMAjGTZNIgTwAcGBBAYyLzgIDCAJ0xUicIQB4B-bESFVCRAFxg5QwgHMANGACSBVgFciugApVm8KmQB8YALxgA3qjBgAFAeNEAlKucwFnZVGQJ1RWJdVktrMlULKzgbMABfVHTUYIYAJUwyIy5MKQBlIjFMeydXdw8yit0qAmZ-MHqiTG03ME1MFU9fR3s8gqLS8o7bLvcuKmxMaVl5SNN9QxNzWOS7D273bl5+YVFxKTCIpV1vDbBEuKm9z3bO262bQYd7Z+7WkcLiyTPWwZVCoKBGAg8PgEMA0Ix4GBkA7Q45iCQeOCsIjYAJgVgiKB4AAeAH5VOotGlBjUwFwlniCcTHGBMdiAHT4zCEolgAA+vLAAHJBaD3ODIYcYVwRBVkfxFuFlkpyfItFd1qs7ttbLt3O5+uclVFHlACKprkQhq8kjYfqo5YIZacFRcomsfJsbXYXI86YqgmwGE5OdywABqIK++lQagAMTNYCazGZHkIPnNGo+9hperAIiIRiEMJzuYD7GmpfcMS9qlNYAAZPWwKbU5nHu50rnO3qY1R42yAPqWpzZR75wsw3vx7qZMUQqH8WlOzBmIRwAC2lEwDpdRv6FIIOndNy1Nh1jwNSwUlxNCYtVtXG63klP3oFr7tYAdqOdhuvbotT17h9XM-TkMsgwZLkmQjIgo39KcEyTFM0xMDMfCzEDS3HIssMrbIK0ras4gSNdN3mNkRGwOAYAAN0wDwW1QvxfHbNJHm7MU4wIQdhwgsc+gnZtuJnUVm3nSUlxOTASjwddWHoHc-xWFUNEPc9c0vRV-zg9xWm-J0JF3HTdFouA8DIUzzO9EswMtbJmRDGDI1A6NuNUZCnA8TCPECBzUlY3NEN45lR1zHDJxEjsxIilwpNlBcCF0aVpNk+TFMS5Ll0fcjt0S9jMnFfKUoqP4xkBCZKlbPBeCoGBnlUZ5fnyf5xgqbNunoS0oBETAAC98mZKA6vmbo7LAdcqFYZkCEwJAAFkpu8sTxpEUZig85oUzkCpNuTJxCBqvA6ueRpEr2zDbPpAALJoyHoIRmUm1g2V6IgPCoRK2WyQK9Vi26CHu4owBJMAAaBoQPB2jozslDk3jIQYVQqUTujW1q2VmeYU0+yVY3nZK6pgGhPoAa0ux5nrZeZ3tx6F8chXjCZgYmyd+9xYvRsZRI5wTcK54oQXQYAwCMahelBcaaRKjoHQrGWZLkhS8sleXsrIrcHQyZk4QRJFEp-dEaScolVEFOkIQ6IRgBFALJfpKi+mZBW0uVh0PEFR2iEFVjxsILhneXd3BX9wVdA8Wi6tUAgjHXGhikwyOYF9+kyEwAOnAV4O064MPPCT6PY-joRE7qlP-X9jhsGYSFA+knLNcSj3-ZIOYa9z8OC7AGO44Tq0aVihuKKomj6IjsuMlYrJAzaSrmUCJOjEwQve8e9I-YII6Trn6owEX5ewAABnY1a69Klqxmq2r6sq37MbmBj-fD6GXmI7YKdc-1WFUylgwRsBgAi0PAJAsuESzuH3sjDobJ97hjxAjDiM475YwYjnZ+lVogIw-n9PmxY2KQLUJVGBdUl5gBIPAr0iCOy-UAXmTAABHeEIg6EFCJCQfET55gkE3GQIGCAqAiG6PfeYrYuBV3bughoFC4jYJmA7PoK9i6OQQZ-cC+YABMP9DzKK9AAoBmgQFCUOtfb41ChEoI8F7SRMNpHv37vBNRCju5F2Bn-XRtDgHhVwWAYxx0b4ozMagVafRj5OEhgvEhB9j6pF0P7DwABmXw5dHFEAAIzMkhvmQ+ugvbeWSZaDRGTLF9FSboHOHh1FJKCbIGimA2TwE0MUoglTUBAA)

## Examples

This code is runnable in both flowtype and typescript

```js
/* @flow */
// ^ flow magic comment to activate. It will be ignored in typescript.

import {
  buildActionCreator,
  createReducer,
  type ActionCreator
} from 'hard-reducer'
// ^ If you use typescript, Do not use `type` before ActionCreator
const { createAction } = buildActionCreator({ prefix: 'counter/' })

// Add type to your payload by ActionCreator
const inc: ActionCreator<number> = createAction('inc')
// or infer by function result
const dec = createAction('dec', (val: number) => val)

inc(1) //=> { type: 'counter/inc', payload: 1 }

// Define state type
type State = { value: number }
const initialState: State = { value: 0 }

const reducer = createReducer(initialState)
  // Handle `(State, Payload) => State` in matched context.
  .case(inc, (state, payload) => {
    return {
      value: state.value + payload
    }
  })
  .case(dec, (state, payload) => {
    // $ExpectError
    const p: string = payload
    return {
      value: state.value - payload
    }
  })
  // Take string
  .case('other/noop', (state, payload) => {
    return state
  })
  // Take all uncaught action, not payload!
  .else((state, action) => {
    console.log('default fallback')
    return state
  })

// Use it
const ret0 = reducer(initialState, inc(3))
const ret1 = reducer(ret1, dec(1))
```

See detail in `index.js.flow` or `index.d.ts`

### Handle async action

`createAsyncAction(...)` returns `{ resolved, rejected, started }` and callable method.

(You need to add `redux-thunk` in store's middlewares)

```js
/* @flow */
import { createReducer, buildActionCreator } from '../'
const { createAsyncAction } = buildActionCreator()

const incAsync = createAsyncAction('inc-async', async (val: number) => {
  if (val % 2 === 1) {
    throw new Error('error')
  }
  return {
    p: 1
  }
})

type Status = 'ready' | 'started' | 'resolved' | 'rejected'
type State = { status: Status, payload: ?{ p: number } }

const reducer = createReducer({ status: 'ready', payload: null })
  .case(incAsync.started, state => {
    return { state: 'started' }
  })
  .case(incAsync.resolved, (state, payload) => {
    return { state: 'resolve', payload }
  })
  .case(incAsync.rejected, (state, error) => {
    return { state: 'ready', payload: null }
  })

// store
import reduxThunk from 'redux-thunk'
import { applyMiddleware, createStore } from 'redux'
const store = createStore(reducer, undefined, applyMiddleware(reduxThunk))
store.subscribe((...args) => {
  console.log('store', store.getState())
})

// dispatch
store.dispatch(incAsync(1))
```

## Related projects

* [reduxactions/redux-actions: Flux Standard Action utilities for Redux.](https://github.com/reduxactions/redux-actions)
* [aikoven/typescript-fsa: Type-safe action creator utilities](https://github.com/aikoven/typescript-fsa)
* [acdlite/flux-standard-action: A human-friendly standard for Flux action objects.](https://github.com/acdlite/flux-standard-action)

## ChangeLog

### v2.0.0

* Add `createAsyncAction(...)`
* Remove `createPromiseAction(...)`
* Remove `Reducer.case(...)`

### v1.0.0

* Add `ActionCreator<Payload>` with one argument
* `createAction(string)` uses `i => i` as default creator function
* Rename `reducer._(...)` => `reducer.else(...)`

## LICENSE

MIT
