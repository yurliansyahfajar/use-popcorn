export function NotifyMessage({ children, message }) {
  return (
    <p className="error">
      {children} {message}
    </p>
  );
}
