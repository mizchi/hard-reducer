/* @flow */
import assert from 'assert'
import { buildActionCreator, createReducer } from '../'
import { combineReducers } from 'redux'

// type and initialState
type State = {
  value: number
}

const initialState: State = { value: 0 }

const { createAction } = buildActionCreator()

const add = createAction('add', (val: number) => {
  if (val === 13) {
    throw new Error('13 is a sinister number')
  }
  return val
})

const r = createReducer(initialState)
  .case(add, (state, payload) => {
    throw new Error('error')
  })
  .catch(add, (state, error) => {
    return state
  })

try {
  r(undefined, add(1))
  process.exit(1)
} catch (e) {
  r(undefined, add(13))
}
