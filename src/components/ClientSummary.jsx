import { money } from "../utils/money";

export default function ClientSummary({ clientName, setClientName, eventDate, setEventDate, lines, subtotal, taxTotal, totalDue }) {
  return (
    <div className="card client">
      <h2>Client Summary</h2>

      <div className="grid2">
        <label>
          Name
          <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Client name" />
        </label>
        <label>
          Date
          <input value={eventDate} onChange={e => setEventDate(e.target.value)} placeholder="MM/DD/YYYY" />
        </label>
      </div>

      <div className="client-items">
        <div className="client-head">Menu Items</div>
        {lines.length === 0 ? (
          <div className="subtle">No items selected yet.</div>
        ) : (
          lines.map(l => (
            <div key={l.id} className="client-line">
              <div className="client-left">
                <div className="client-name">{l.name}</div>
                <div className="subtle">{l.qtyDisplay}</div>
              </div>
              <div className="client-right">{money(l.lineTotal)}</div>
            </div>
          ))
        )}
      </div>

      <div className="client-totals">
        <div className="totals-row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
        <div className="totals-row"><span>Tax</span><span>{money(taxTotal)}</span></div>
        <div className="totals-row grand"><span>Pay This Amount</span><span>{money(totalDue)}</span></div>
      </div>

      <div className="divider" />

      <div className="disclaimer">
        <div><strong>For all orders over $800, a 25% non-refundable deposit is required.</strong></div>
        <div>Make checks payable to: <strong>B&amp;T Food Services, LLC</strong>.</div>
        <div>We accept all major credit cards, Venmo, PayPal, and cash.</div>
      </div>
    </div>
  );
}
