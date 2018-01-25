/* @flow */
import reduxPromise from 'redux-promise'
import { applyMiddleware, createStore } from 'redux'
import { createReducer, buildActionCreator } from '../'

const { createPromiseAction } = buildActionCreator()

const wait = ms => new Promise(fullfill => setTimeout(fullfill, ms))
const incAsync = createPromiseAction('inc-async', async (val: number) => {
  await wait(100)
  if (val === 13) {
    throw new Error('error')
  }
  return val
})

const r = createReducer({ value: 0 })
  .case(incAsync, (state, payload) => {
    return { value: state.value + payload }
  })
  .catch(incAsync, (state, error) => {
    console.log('13 has come')
    return state
  })

const store = createStore(r, undefined, applyMiddleware(reduxPromise))

store.dispatch(incAsync(2))
store.dispatch(incAsync(4))
store.dispatch(incAsync(13))
