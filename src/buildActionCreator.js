/* @flow */
import uuid from "uuid";

export default function buildActionCreator(opts: { prefix?: string } = {}) {
  const prefix = opts.prefix || "";

  function createAction<Input, Payload>(
    t: string = uuid(),
    fn?: Input => Payload
  ): Input => { type: string, payload: Payload } {
    const type = prefix + t;
    const fsaFn: any = (input: Input) => {
      try {
        // covert input by fn modifier
        const payload = fn ? fn(input) : input;
        return {
          type,
          payload
        };
      } catch (e) {
        return {
          type,
          error: true,
          payload: e
        };
      }
    };
    fsaFn.type = type;
    return fsaFn;
  }

  function createThunkAction<Input>(t: string = uuid(), fn: any) {
    const type = prefix + t;
    const started = type + "/started";
    const resolved = type + "/resolved";
    const rejected = type + "/rejected";

    const fsaFn: any = (input: Input) => {
      return (dispatch, getState) => {
        dispatch({ type: started });
        return Promise.resolve(fn(input, dispatch, getState))
          .then(payload => {
            dispatch({ type: resolved, payload });
          })
          .catch(error => {
            dispatch({ type: rejected, payload: error, error: true });
          });
      };
    };

    const retFn: any = (input: Input) => fsaFn(input);
    retFn.started = started;
    retFn.resolved = resolved;
    retFn.rejected = rejected;
    return retFn;
  }

  function createAsyncAction<Input, Payload>(
    t: string = uuid(),
    fn: Input => Promise<Payload>
  ): {
    started: string,
    resolved: string,
    rejected: string
  } {
    const type = prefix + t;
    const started = type + "/started";
    const resolved = type + "/resolved";
    const rejected = type + "/rejected";

    const fsaFn: any = input => dispatch => {
      dispatch({ type: started });
      return Promise.resolve(fn(input))
        .then(ret => {
          dispatch({
            type: resolved,
            payload: ret
          });
          return ret;
        })
        .catch(err => {
          dispatch({
            type: rejected
          });
          return err;
        });
    };

    const retFn: any = (input: Input) => fsaFn(input);
    retFn.started = started;
    retFn.resolved = resolved;
    retFn.rejected = rejected;

    return retFn;
  }

  return { createAction, createAsyncAction, createThunkAction, prefix };
}
