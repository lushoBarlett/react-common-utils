import { useState } from 'react'
import { act, renderHook } from '@testing-library/react-hooks'
import { useConst, useToggle, useLens, useLensPath } from '../index'


// TODO: test async functions


test("const", () => {
  const { result, rerender } = renderHook(value => useConst(value), { initialProps: 0 });

  expect(result.current).toBe(0);

  rerender(1);

  expect(result.current).toBe(0);
});


test("toggle", () => {
  const { result } = renderHook(() => { 
    const [state, toggle] = useToggle();
    return { state, toggle };
  });

  expect(result.current.state).toBe(false);

  act(() => result.current.toggle())

  expect(result.current.state).toBe(true);

  act(() => result.current.toggle())

  expect(result.current.state).toBe(false);
});


test("lens with object", () => {
  const object = { test: 0 };

  const { result } = renderHook(initial => {
    const [state, setState] = useState(initial);
    const [lens, setLens] = useLens(state, setState, "test");
    return { state, lens, setLens };
  }, { initialProps: object });

  expect(result.current.state.test).toBe(0);
  expect(result.current.lens).toBe(0);

  act(() => result.current.setLens(1));

  expect(result.current.state.test).toBe(1);
  expect(result.current.lens).toBe(1);
});


test("lens with array", () => {
  const array = [0];

  const { result } = renderHook(initial => {
    const [state, setState] = useState(initial);
    const [lens, setLens] = useLens(state, setState, 0);
    return { state, lens, setLens };
  }, { initialProps: array });

  expect(result.current.state[0]).toBe(0);
  expect(result.current.lens).toBe(0);

  act(() => result.current.setLens(1));

  expect(result.current.state[0]).toBe(1);
  expect(result.current.lens).toBe(1);
});


test("lens path", () => {
  const object = {
    test: [
      {
        test: 0
      }
    ]
  };

  const { result } = renderHook(initial => {
    const [state, setState] = useState(initial);
    const [lens, setLens] = useLensPath(state, setState, ["test", 0, "test"]);
    return { state, lens, setLens };
  }, { initialProps: object });

  expect(result.current.state.test[0].test).toBe(0);
  expect(result.current.lens).toBe(0);

  act(() => result.current.setLens(1));

  expect(result.current.state.test[0].test).toBe(1);
  expect(result.current.lens).toBe(1);
});