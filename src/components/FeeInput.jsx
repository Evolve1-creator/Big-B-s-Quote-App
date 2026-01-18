export default function FeeInput({ label, value, onChange }) {
  return (
    <label>
      {label}
      <input
        type="number"
        min="0"
        step="0.01"
        inputMode="decimal"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="$"
      />
    </label>
  );
}
