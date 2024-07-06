import { useEffect, useRef } from "react";

export function Search({ search, onSearch }) {
  const inputEl = useRef(null);

  useEffect(() => {
    function callback(e) {
      if (document.activeElement === inputEl.current) {
        return;
      }
      if (e.code === "Enter") {
        inputEl.current.focus();
        onSearch("");
      }
    }

    document.addEventListener("keydown", callback);
    return () => {
      document.addEventListener("keydown", callback);
    };
  }, [onSearch]);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={search}
      onChange={(e) => onSearch(e.target.value)}
      ref={inputEl}
    />
  );
}
