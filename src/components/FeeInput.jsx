export default function FeeInput({ label, value, onChange }) {
  return (
    <label>
      {label}
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="$"
      />
    </label>
  );
}