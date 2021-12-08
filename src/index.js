import { useState, useCallback, useMemo } from 'react';

function sleep(delay) {
  return new Promise(resolve =>
    setTimeout(() => resolve(undefined), delay));
}

function useAsync(process, dependencyList) {
  const [result, setResult] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const call = useCallback(async () => {
    try {
      setLoading(true);
      setError(undefined);
      setResult(undefined);
      setResult(await process());
    } catch(error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, dependencyList);

  return [result, error, loading, call];
}

function useStateSync(
  initial,
  refresh,
  refreshDependencyList,
  sync,
  syncDependencyList
) {
  const [state, setState] = useState(initial);
  
  let result, error, loading, call;

  [result, error, loading, call] = useAsync(async () => {
    setState(await refresh());
  }, [setState, ...refreshDependencyList]);

  const refreshInfo = { result, error, loading, call };

  [result, error, loading, call] = useAsync(async () => {
    return sync(state);
  }, [state, ...syncDependencyList]);

  const syncInfo = { result, error, loading, call };

  return [state, setState, refreshInfo, syncInfo];
}

function useConst(state) {
  return useMemo(() => state, []);
}

function useToggle(initial = false) {
  const [state, setState] = useState(initial);

  const toggle = useConst(() => setState(state => !state));

  return [state, toggle];
}

function useLens(state, setState, key) {
  const lens = useMemo(() => state[key], [state, key]);

  const setLens = useCallback(newLens => {

    let newState;
    if (Array.isArray(state))
      newState = [...state];
    else
      newState = Object.assign({}, state);

    newState[key] = newLens;
    setState(newState);
  }, [state, setState, key]);

  return [lens, setLens];
}

function useLensPath(state, setState, keys) {
  let [lens, setLens] = [state, setState];

  for (const key of keys)
    [lens, setLens] = useLens(lens, setLens, key)

  return [lens, setLens];
}

export {
  sleep,
  useAsync,
  useAsyncState,
  useConst,
  useToggle,
  useLens,
  useLensPath,
};
