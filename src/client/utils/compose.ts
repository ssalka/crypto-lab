import { flow } from 'lodash/fp';

type InputFunction<T> = (input: T) => any;

type AnyFunction = (...args: any[]) => any;

const unsafeFlow = flow as any;

export default function compose<T, R>(
  fn: InputFunction<T>, ...fns: AnyFunction[]
): (input: T) => R {
  return unsafeFlow([fn, ...fns]);
}
