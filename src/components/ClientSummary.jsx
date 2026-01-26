import { money } from "../utils/money";

export default function ClientSummary({ clientName, setClientName, eventDate, setEventDate, lines, taxTotal, totalDue }) {
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
          <ul className="client-list">
            {lines.map(l => (
              <li key={l.id}>{l.name}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="client-totals">
        {taxTotal > 0 && (
          <div className="totals-row">
            <span>Sales Tax</span>
            <span>{money(taxTotal)}</span>
          </div>
        )}
        <div className="totals-row grand">
          <span>Total</span>
          <span>{money(totalDue)}</span>
        </div>
      </div>

      
      <div className="divider" />

      <div className="contact">
        <strong>Phone:</strong> 803-600-5386
      </div>



      <div className="disclaimer">
        <div><strong>For all orders over $800, a 25% non-refundable deposit is required.</strong></div>
        <div>Make checks payable to: <strong>B&amp;T Food Services, LLC</strong>.</div>
        <div>We accept all major credit cards, Venmo, PayPal, and cash.</div>
      </div>
    </div>
  );
}