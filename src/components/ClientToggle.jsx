export default function ClientToggle({ enabled, onToggle }) {
  return (
    <button onClick={onToggle}>
      Client View: {enabled ? "ON" : "OFF"}
    </button>
  );
}