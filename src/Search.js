export function Search({ search, onSearch }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={search}
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}
