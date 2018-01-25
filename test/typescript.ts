import { buildActionCreator, createReducer } from '../';
const { createAction } = buildActionCreator({ prefix: 'counter/' });

const inc = createAction('inc', (val: number) => val)
const dec = createAction('dec', (val: number) => val)

inc(1) //=> { type: 'counter/inc', payload: 1 }

type State = { value: number }

const initialState = { value: 0 }

const reducer = createReducer(initialState)
  // Handle `(State, Payload) => State` in matched context.
  .case(inc, (state, payload) => {
    return {
      value: state.value + payload
    }
  })
  .case(dec, (state, payload) => {
    const p = payload //=> number
    return {
      value: state.value - p
    }
  })

// Use it
const assert = require('assert');

const ret0 = reducer(initialState, inc(3))
const ret1 = reducer(ret0, dec(1))

assert(ret0.value === 3)
assert(ret1.value === 2)
assert(inc(1).type === 'counter/inc')
