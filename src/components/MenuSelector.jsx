export default function MenuSelector({ menu, value, onChange }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}>
      {menu.map(m => (
        <option key={m.id} value={m.id}>{m.name}</option>
      ))}
    </select>
  );
}