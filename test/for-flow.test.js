/* @flow */
import assert from 'assert'
import { buildActionCreator, createReducer } from '../'

const {
  createAction,
  createSimpleAction,
  createPromiseAction
} = buildActionCreator({
  prefix: 'counter/'
})

const reset = createSimpleAction('reset')
const inc = createAction('inc', (val: number) => val)
const dec = createAction('dec', (val: number) => val)
const incAsync = createPromiseAction('inc-async', (val: number) => {
  return Promise.resolve(val)
})

type State = { value: number }
const initialState = { value: 0 }
const r = createReducer(initialState)
  .case(inc, (state, payload) => {
    // $ExpectError
    const p: string = payload
    return {
      value: state.value + payload
    }
  })
  .case(dec, (state, payload) => {
    return {
      value: state.value - payload
    }
  })
  // require redux-promise-middleware
  .case(incAsync, (state, payload) => {
    const ret: number = payload
    // $ExpectError
    const ret2: string = payload
    return initialState
  })
  .case(reset, (state, payload) => {
    // $ExpectError
    const ret: number = payload
    return initialState
  })

const ret0 = r({ value: 0 }, inc(3))
const ret1 = r(ret0, reset())
const ret2 = r(ret1, dec(2))

assert(ret0.value === 3)
assert(ret1.value === 0)
assert(ret2.value === -2)
assert(inc(1).type === 'counter/inc')
