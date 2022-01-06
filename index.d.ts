import { DependencyList, Dispatch, SetStateAction } from 'react';

declare function sleep(delay: number): Promise<void>;

declare type Process<T> = () => Promise<T>;

declare interface AsyncResult<T, E> {
  result: T,
  error: E,
  loading: boolean,
  call: Process<void>
}

declare function useAsync<T, E = unknown>(
  process: Process<T>,
  dependecyList: DependencyList
): AsyncResult<T, E>;

declare function useAsyncState<T, R, TE = unknown, RE = unknown>(
  initial: T,
  refresh: Process<T>,
  refreshDependecnyList: DependencyList,
  sync: Process<R>,
  syncDependencyList: DependencyList
): [T, Dispatch<SetStateAction<T>>, AsyncResult<T, TE>, AsyncResult<R, RE>];

declare function useConst<T>(state: T): T;

declare function useToggle(
  initial?: boolean
): [boolean, () => void];

declare function useLens<T, K extends keyof T>(
  state: T,
  setState: Dispatch<SetStateAction<T>>,
  key: K
): [T[K], Dispatch<T[K]>];

type Cons<Head, Tail> =
  Tail extends Array<unknown> ?
    [Head, ...Tail]
  :
  never;

type NonEmptyCons<Head, Tail> =
  Tail extends [] ?
    never
  :
  Cons<Head, Tail>;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, ...Array<never>]

type Paths<T, D extends number = 8> =
  [D] extends [never] ?
    never
  :
  T extends object ?
    {
      [K in keyof T]-?: [K] | NonEmptyCons<K, Paths<T[K], Prev[D]>>
    }[keyof T]
  :
  [];

type Access<T, Path> =
  Path extends [] ?
    never
  :
  Path extends [infer K] ?
    K extends keyof T ? T[K] : never
  :
  Path extends [infer K, ...infer Rest] ?
    K extends keyof T ? Access<T[K], Rest> : never
  :
  never;

declare function useLensPath<T, K extends Paths<T>>(
  state: T,
  setState: Dispatch<SetStateAction<T>>,
  keys: Array<K>
): [Access<T, K>, Dispatch<Access<T, K>>];

type DispatchObject<T, K extends keyof T> = {
  [P in K]: Dispatch<T[K]>
}

declare function useLensGroup<T, K extends keyof T>(
  state: T,
  setState: Dispatch<SetStateAction<T>>,
  keys?: Array<K>
): [Pick<T, K>, DispatchObject<T, K>];

export {
  sleep,
  type Process,
  type AsyncResult,
  useAsync,
  useAsyncState,
  useConst,
  useToggle,
  useLens,
  useLensPath,
  useLensGroup,
};