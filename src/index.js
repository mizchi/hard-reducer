/* @flow */
import type { ActionCreator, Reducer } from '../types'

export function buildActionCreator(opts: { prefix?: string }) {
  const prefix = opts.prefix || ''

  function createAction<Input, Payload>(
    t: string,
    fn: Input => Payload
  ): ActionCreator<Input, Payload> {
    const type = prefix + t
    const fsaFn: any = (input: Input) => {
      return {
        type,
        payload: fn(input)
      }
    }
    fsaFn._t = type
    return fsaFn
  }

  function createPromiseAction<Input, Payload>(
    t: string,
    fn: Input => Promise<Payload> | Payload
  ): ActionCreator<Input, Payload> {
    const type = prefix + t
    const fsaFn: any = (input: Input) => {
      return {
        type,
        payload: Promise.resolve(fn(input))
      }
    }
    fsaFn._t = type
    return fsaFn
  }

  function createSimpleAction(t: string): ActionCreator<void, void> {
    const type = prefix + t
    const fsaFn: any = () => ({ type })
    fsaFn._t = type
    return fsaFn
  }

  return { createAction, createSimpleAction, createPromiseAction }
}

export function createReducer<State>(initialState: State): Reducer<State> {
  const map = new Map()

  const reducer: any = (state: any = initialState, action: any) => {
    const handler = map.get(action.type)
    return handler ? handler(state, action.payload) : state
  }

  reducer.case = (actionFunc, callback) => {
    if (map.has(actionFunc._t)) {
      throw new Error(`hard-reducer: ${actionFunc._t} already exsits in cases`)
    }
    map.set(actionFunc._t, callback)
    return reducer
  }
  return reducer
}
