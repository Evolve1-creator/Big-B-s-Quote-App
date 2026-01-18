export default function QuoteLine({ item, pans, total }) {
  return (
    <div className="line">
      <strong>{item.name}</strong>
      <div>{pans.full} full / {pans.half} half</div>
      <div>${total.toFixed(2)}</div>
    </div>
  );
}