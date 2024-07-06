import { useRef } from "react";
import { useKey } from "./useKey";

export function Search({ search, onSearch }) {
  const inputEl = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) {
      return;
    }
    inputEl.current.focus();
    onSearch("");
  });

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
