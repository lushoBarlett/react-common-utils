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

declare function useLens<T, K extends keyof T, L extends T[K]>(
  state: T,
  setState: Dispatch<SetStateAction<T>>,
  key: K
): [L, Dispatch<L>];

type AnyKey = number | string | symbol;

declare function useLensPath<T, K extends AnyKey, L>(
  state: T,
  setState: Dispatch<SetStateAction<T>>,
  key: Array<K>
): [L, Dispatch<L>];

declare function useLensGroup<T, K extends keyof T, L extends Partial<T>>(
  state: T,
  setState: Dispatch<SetStateAction<T>>,
  keys?: Array<K>
): [L, T extends Array<unknown> ? Array<Dispatch<T[K]>> : Record<K, Dispatch<T[K]>>];

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