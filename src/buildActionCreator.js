/* @flow */
import uuid from 'uuid'

export default function buildActionCreator(opts: { prefix?: string } = {}) {
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
