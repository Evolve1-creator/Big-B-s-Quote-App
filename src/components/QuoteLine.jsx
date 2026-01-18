export default function QuoteLine({ line, onRemove, showPerPerson }) {
  return (
    <div className="line">
      <div className="line-head">
        <strong>{line.name}</strong>
        <button className="link" onClick={onRemove} type="button" aria-label="Remove item">
          Remove
        </button>
      </div>
      <div className="line-meta">{line.full} full / {line.half} half</div>
      <div className="line-price">
        <span>${Number(line.sell || 0).toFixed(2)}</span>
        {showPerPerson && (
          <span className="subtle">(${Number(line.perPerson || 0).toFixed(2)} / person)</span>
        )}
      </div>
    </div>
  );
}
