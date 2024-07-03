export function ToogleButton({ onClick, children }) {
  return (
    <button className="btn-toggle" onClick={onClick}>
      {children}
    </button>
  );
}
