import { money } from "../utils/money";

function deriveServiceType(selectedMap) {
  const onsite = !!selectedMap?.onsite_service;
  const delivery = !!selectedMap?.delivery;

  if (onsite && delivery) return "On-site + Delivery";
  if (onsite) return "On-site Service";
  if (delivery) return "Delivery";
  return "—";
}

export default function ReceiptPage({
  clientName,
  eventDate,
  people,
  selectedMap,
  itemNames,
  subtotal,
  taxTotal,
  total,
  onBack
}) {
  const serviceType = deriveServiceType(selectedMap);

  return (
    <div className="page receipt-page">
      <header className="topbar">
        <div className="brandwrap">
          <img src="/logo.png" alt="Big B’s BBQ Catering logo" className="logo" />
          <div>
            <div className="brand">Big B’s BBQ Catering</div>
            <div className="subtle">Client Receipt</div>
          </div>
        </div>

        <div className="row">
          <button className="btn-secondary" type="button" onClick={onBack}>
            ← Back to Quote
          </button>
          <button className="btn" type="button" onClick={() => window.print()}>
            Print
          </button>
        </div>
      </header>

      <div className="receipt card">
        <div className="receipt-head">
          <div className="receipt-title">Receipt</div>
          <div className="receipt-meta subtle">For client use</div>
        </div>

        <div className="receipt-fields">
          <div className="rf">
            <div className="label">Name</div>
            <div className="value">{clientName || "—"}</div>
          </div>
          <div className="rf">
            <div className="label">Event date</div>
            <div className="value">{eventDate || "—"}</div>
          </div>
          <div className="rf">
            <div className="label">Guests</div>
            <div className="value">{people ? `${people}` : "—"}</div>
          </div>
          <div className="rf">
            <div className="label">Service</div>
            <div className="value">{serviceType}</div>
          </div>
        </div>

        <div className="receipt-divider" />

        <div className="receipt-items">
          <div className="section-title">Items</div>
          {itemNames.length === 0 ? (
            <div className="subtle">No items selected.</div>
          ) : (
            <ul className="itemlist">
              {itemNames.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="receipt-divider" />

        <div className="receipt-totals">
          <div className="totals-row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          <div className="totals-row"><span>Tax</span><span>{money(taxTotal)}</span></div>
          <div className="totals-row grand"><span>Total</span><span>{money(total)}</span></div>
        </div>
      </div>
    </div>
  );
}
