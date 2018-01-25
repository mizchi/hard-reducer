/* @flow */
import type { Reducer } from '../'

export default function createReducer<State>(
  initialState: State
): Reducer<State> {
  const handlerMap = new Map()
  const errorHandlerMap = new Map()

  const reducer: Function = (
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
