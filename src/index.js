/* @flow */
import uuid from 'uuid'
import type { Reducer } from '../'

export function buildActionCreator(opts: { prefix?: string } = {}) {
  const prefix = opts.prefix || ''

  function createAction<Input, Payload>(
    t: string = uuid(),
    fn?: Input => Payload
  ): Input => { type: string, payload: Payload } {
    const type = prefix + t
    const fsaFn: any = (input: Input) => {
      try {
        const payload = fn ? fn(input) : null
        return {
          type,
          payload
        }
      } catch (e) {
        return {
          type,
          error: true,
          payload: e
        }
      }
    }
    fsaFn._t = type
    return fsaFn
  }

  function createPromiseAction<Input, Payload>(
    t: string = uuid(),
    fn: Input => Promise<Payload>
  ): Input => Promise<Payload> {
    const type = prefix + t
    const fsaFn: any = (input: Input) => {
      const payload = fn(input)
      return {
        type,
        payload
      }
    }
    fsaFn._t = type
    return fsaFn
  }

  function createSimpleAction(t: string): () => void {
    const type = prefix + t
    const fsaFn: any = () => ({ type })
    fsaFn._t = type
    return fsaFn
  }

  return { createAction, createSimpleAction, createPromiseAction }
}

export function createReducer<State>(initialState: State): Reducer<State> {
  const handlerMap = new Map()
  const errorHandlerMap = new Map()

  const reducer: any = (
    state: State | void = initialState,
    action: { type: string, payload: any }
  ) => {
    if (action.payload instanceof Error && errorHandlerMap.has(action.type)) {
      const handler: any = errorHandlerMap.get(action.type)
      return handler(state, action.payload)
    } else if (handlerMap.has(action.type)) {
      const handler: any = handlerMap.get(action.type)
      return handler(state, action.payload)
    } else {
      return state
    }
  }

  reducer.case = (actionFunc, _reducer) => {
    if (handlerMap.has(actionFunc._t)) {
      throw new Error(`hard-reducer: ${actionFunc._t} already exsits in cases`)
    }
    handlerMap.set(actionFunc._t, _reducer)
    return reducer
  }

  reducer.catch = (actionFunc, _reducer) => {
    if (errorHandlerMap.has(actionFunc._t)) {
      throw new Error(`hard-reducer: ${actionFunc._t} already exsits in catch`)
    }
    errorHandlerMap.set(actionFunc._t, _reducer)
    return reducer
  }
  return reducer
}
