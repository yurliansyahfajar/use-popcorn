import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  const [value, setvalue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setvalue];
}
