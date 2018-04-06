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
        // covert result by fn modifier
        const payload = fn ? fn(input) : input
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

  return { createAction, createPromiseAction, prefix }
}
