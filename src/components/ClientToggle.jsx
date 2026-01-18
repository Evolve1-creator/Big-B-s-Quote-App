export default function ClientToggle({ enabled, onToggle }) {
  return (
    <button className={enabled ? "toggle toggle-on" : "toggle"} onClick={onToggle} type="button">
      Client View: {enabled ? "ON" : "OFF"}
    </button>
  );
}
