import { buildActionCreator, createReducer, ActionCreator } from '../'
const { createAction, createAsyncAction } = buildActionCreator({
  prefix: 'counter/'
})

const reset = createAction()
const inc = createAction('inc', (val: number) => val)
const dec = createAction('dec', (val: number) => val)
// typed with ActionCreator
const foo: ActionCreator<{ foo: number }> = createAction('foo')

const incAsync = createAsyncAction('inc-async', async (val: number) => {
  return val
})

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
  // require redux-thunk
  .case(incAsync.started, (state, payload) => {
    return state
  })
  .case(incAsync.resolved, (state, payload) => {
    // $ExpectError
    // const p: string = payload
    return state
  })
  .case(incAsync.rejected, (state, error) => {
    return state
  })
  .case(reset, state => {
    return initialState
  })
  .else((state, action) => {
    // console.log(action)
    return state
  })
  .case(foo, (state, payload) => {
    // $ExpectError
    // const pe: { foo: string } = payload
    return initialState
  })
  // .case('nop', (state, payload) => {
  //   return state
  // })
  .else((state, action) => {
    // console.log(action)
    return state
  })

// Use it
const assert = require('assert')

const ret0 = reducer(initialState, inc(3))
const ret1 = reducer(ret0, dec(1))

assert(ret0.value === 3)
assert(ret1.value === 2)
assert(inc(1).type === 'counter/inc')
