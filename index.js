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

  return { result, error, loading, call };
}

function useAsyncState(
  initial,
  refresh,
  refreshDependencyList,
  sync,
  syncDependencyList
) {
  const [state, setState] = useState(initial);
  
  const refreshInfo = useAsync(async () => {
    const result = await refresh();
    setState(result);
    return result;
  }, [setState, ...refreshDependencyList]);

  const syncInfo = useAsync(async () => {
    return sync(state);
  }, [state, ...syncDependencyList]);

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

function updateState(state, key, value) {
  let newState =
    Array.isArray(state)
    ? [...state]
    : Object.assign({}, state);

  newState[key] = value;

  return newState;
}

function updateStateRecursive(state, [key, ...keys], value) {
  if (keys.length === 0)
    return updateState(state, key, value);
  
  const newChild = updateStateRecursive(state[key], keys, value);
  return updateState(state, key, newChild);
}

function diff(oldState, setStateAction) {
  return (
    typeof setStateAction === "function"
    ? setStateAction(oldState)
    : setStateAction
  );
}

function computeLens(state, key) {
  return state[key];
}

function computeLensPath(state, keys) {
  return keys.reduce((lens, key) => lens[key], state);
}

function computeLensGroup(state, keys) {
  return keys.reduce((lens, key) => {
    lens[key] = state[key];
    return lens;
  }, Array.isArray(state) ? [] : {});
}

function useLens(state, setState, key) {
  const lens = useMemo(() => computeLens(state, key), [state, key]);

  const setLens = useCallback(newLens =>
    setState(state =>
      updateState(state, key, diff(computeLens(state, key), newLens)))
  , [state, setState, key]);

  return [lens, setLens];
}

function useLensPath(state, setState, keys) {
  const lens = useMemo(() => computeLensPath(state, keys), [state, keys]);

  const setLens = useCallback(newLens =>
    setState(state =>
      updateStateRecursive(state, keys, diff(computeLensPath(state, keys), newLens)))
  , [state, setState, keys]);

  return [lens, setLens];
}

function useLensGroup(state, setState, keys) {
  const resolvedKeys = useMemo(() =>
    keys ?? Object.keys(state)
  , [state, keys]);

  const lens = useMemo(() => computeLensGroup(state, resolvedKeys), [state, resolvedKeys]);

  const setLens = useMemo(() =>
    resolvedKeys.reduce((setLens, key) => {
      setLens[key] = newLens =>
        setState(state => updateState(state, key, diff(computeLens(state, key), newLens)));
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
