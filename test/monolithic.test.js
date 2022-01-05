import { useState } from 'react'
import { act, renderHook } from '@testing-library/react-hooks'
import { useConst, useToggle, useLens, useLensPath, useLensGroup } from '../index'


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


test("lens group with object", () => {
  const object = {
    test1: 1,
    test2: 1,
    test3: 1,
    test4: 1,
  };

  const { result } = renderHook(initial => {
    const [state, setState] = useState(initial);
    const [lens, setLens] = useLensGroup(state, setState);
    return { state, lens, setLens };
  }, { initialProps: object });

  expect(result.current.lens).toEqual(result.current.state);

  act(() => {
    result.current.setLens.test1(2);
    result.current.setLens.test2(3);
    result.current.setLens.test3(4);
    result.current.setLens.test4(5);
  });

  expect(result.current.lens).toEqual(result.current.state);
});


test("lens group with array", () => {
  const array = [1, 1, 1, 1];

  const { result } = renderHook(initial => {
    const [state, setState] = useState(initial);
    const [lens, setLens] = useLensGroup(state, setState);
    return { state, lens, setLens };
  }, { initialProps: array });

  expect(result.current.lens).toEqual(result.current.state);

  act(() => {
    result.current.setLens[0](2);
    result.current.setLens[1](3);
    result.current.setLens[2](4);
    result.current.setLens[3](5);
  });

  expect(result.current.lens).toEqual(result.current.state);
});


test("lens partial group with object", () => {
  const object = {
    test1: 1,
    test2: 1,
    test3: 1,
    test4: 1,
  };

  const { result } = renderHook(initial => {
    const [state, setState] = useState(initial);
    const [lens, setLens] = useLensGroup(state, setState, ["test1", "test3"]);
    return { state, lens, setLens };
  }, { initialProps: object });

  expect(Object.keys(result.current.lens).length).toBe(2);

  expect(result.current.lens.test1).toBe(result.current.state.test1);
  expect(result.current.lens.test3).toBe(result.current.state.test3);

  act(() => {
    result.current.setLens.test1(2);
    result.current.setLens.test3(4);
  });

  expect(result.current.lens.test1).toBe(result.current.state.test1);
  expect(result.current.lens.test3).toBe(result.current.state.test3);
});


test("lens partial group with array", () => {
  const array = [1, 1, 1, 1];

  const { result } = renderHook(initial => {
    const [state, setState] = useState(initial);
    const [lens, setLens] = useLensGroup(state, setState, [1, 3]);
    return { state, lens, setLens };
  }, { initialProps: array });

  expect(result.current.lens.filter(Boolean).length).toBe(2);

  expect(result.current.lens[1]).toBe(result.current.state[1]);
  expect(result.current.lens[3]).toBe(result.current.state[3]);

  act(() => {
    result.current.setLens[1](3);
    result.current.setLens[3](5);
  });

  expect(result.current.lens[1]).toBe(result.current.state[1]);
  expect(result.current.lens[3]).toBe(result.current.state[3]);
});