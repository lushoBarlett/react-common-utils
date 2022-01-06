const { useState, useCallback, useMemo } = require("react");

function sleep(delay) {
  return new Promise(resolve =>
    setTimeout(() => resolve(), delay));
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

function useAsyncState(
  initial,
  refresh,
  refreshDependencyList,
  sync,
  syncDependencyList
) {
  const [state, setState] = useState(initial);
  
  let result, error, loading, call;

  [result, error, loading, call] = useAsync(async () => {
    const result = await refresh();
    setState(result);
    return result;
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

function withChangedKey(state, key, value) {
  let newState =
    Array.isArray(state)
    ? [...state]
    : Object.assign({}, state);

  newState[key] = value;

  return newState;
}

function withChangedKeyPath(state, [key, ...keys], value) {
  if (keys.length === 0)
    return withChangedKey(state, key, value);
  
  const newChild = withChangedKeyPath(state[key], keys, value);
  return withChangedKey(state, key, newChild);
}

function useLens(state, setState, key) {
  const lens = useMemo(() => state[key], [state, key]);

  const setLens = useCallback(newLens =>
    setState(withChangedKey(state, key, newLens))
  , [state, setState, key]);

  return [lens, setLens];
}

function useLensPath(state, setState, keys) {
  const lens = useMemo(() =>
    keys.reduce((lens, key) => lens[key], state)
  , [state, keys]);

  const setLens = useCallback(newLens =>
    setState(withChangedKeyPath(state, keys, newLens))
  , [state, setState, keys]);

  return [lens, setLens];
}

function useLensGroup(state, setState, keys) {
  const resolvedKeys = useMemo(() =>
    keys ?? Object.keys(state)
  , [state, keys]);

  const lens = useMemo(() =>
    resolvedKeys.reduce((lens, key) => {
      lens[key] = state[key];
      return lens;
    }, Array.isArray(state) ? [] : {})
  , [state, resolvedKeys]);

  const setLens = useMemo(() =>
    resolvedKeys.reduce((setLens, key) => {
      setLens[key] = value => setState({ ...state, [key]: value });
      return setLens;
    }, Array.isArray(state) ? [] : {})
  , [state, setState, resolvedKeys]);

  return [lens, setLens];
}

module.exports = {
  sleep,
  useAsync,
  useAsyncState,
  useConst,
  useToggle,
  useLens,
  useLensPath,
  useLensGroup,
};
