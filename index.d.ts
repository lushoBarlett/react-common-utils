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
  dependecyList: React.DependencyList
): AsyncResult<T, E>;

declare function useAsyncState<T, R, TE = unknown, RE = unknown>(
  initial: T,
  refresh: Process<T>,
  refreshDependecnyList: React.DependencyList,
  sync: Process<R>,
  syncDependencyList: React.DependencyList
): [T, React.Dispatch<React.SetStateAction<T>>, AsyncResult<T, TE>, AsyncResult<R, RE>];

declare function useConst<T>(state: T): T;

declare function useToggle(
  initial?: boolean
): [boolean, () => void];

declare function useLens<T extends Record<number | string, unknown>>(
  state: T,
  setState: React.Dispatch<React.SetStateAction<T>>,
  key: number | string
): [T[typeof key], React.Dispatch<T[typeof key]>];

declare function useLensPath<T extends Record<number | string, unknown>, L = unknown>(
  state: T,
  setState: React.Dispatch<React.SetStateAction<T>>,
  key: Array<number | string>
): [L, React.Dispatch<L>];