import { useEffect, useMemo, useState } from "react";
import menu from "./data/menu.json";
import { calculatePans } from "./utils/panCalculator";
import { priceItem } from "./utils/pricingEngine";
import { sumFees } from "./utils/feeEngine";
import MenuSelector from "./components/MenuSelector";
import FeeInput from "./components/FeeInput";
import ClientToggle from "./components/ClientToggle";
import QuoteLine from "./components/QuoteLine";

const LS_KEY = "catering_quote_v1";

function money(n) {
  const num = Number(n || 0);
  return `$${num.toFixed(2)}`;
}

export default function App() {
  const [guests, setGuests] = useState("");
  const [itemId, setItemId] = useState(menu[0]?.id ?? "");
  const [lines, setLines] = useState([]);

  const [serviceFee, setServiceFee] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");

  // Taxes
  const [localTaxPct, setLocalTaxPct] = useState(""); // percent, optional (county+city combined for now)
  const STATE_TAX_RATE = 0.06;

  // Client-safe view
  const [clientView, setClientView] = useState(false);

  // Load last quote (stability: small & predictable; no accounts/backend)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved?.guests != null) setGuests(String(saved.guests));
      if (saved?.itemId) setItemId(saved.itemId);
      if (Array.isArray(saved?.lines)) setLines(saved.lines);
      if (saved?.serviceFee != null) setServiceFee(String(saved.serviceFee));
      if (saved?.deliveryFee != null) setDeliveryFee(String(saved.deliveryFee));
      if (saved?.localTaxPct != null) setLocalTaxPct(String(saved.localTaxPct));
      if (saved?.clientView != null) setClientView(!!saved.clientView);
    } catch {
      // ignore corrupt storage; keep app usable
    }
  }, []);

  // Persist small state changes
  useEffect(() => {
    try {
      const payload = {
        guests: Number(guests) || 0,
        itemId,
        lines,
        serviceFee: Number(serviceFee) || 0,
        deliveryFee: Number(deliveryFee) || 0,
        localTaxPct: Number(localTaxPct) || 0,
        clientView
      };
      localStorage.setItem(LS_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }
  }, [guests, itemId, lines, serviceFee, deliveryFee, localTaxPct, clientView]);

  const guestsNum = useMemo(() => Number(guests), [guests]);
  const selectedItem = useMemo(() => menu.find(m => m.id === itemId) ?? menu[0], [itemId]);

  const addItem = () => {
    if (!Number.isFinite(guestsNum) || guestsNum <= 0) return;
    if (!selectedItem) return;

    const pans = calculatePans(guestsNum, selectedItem.fullPanFeeds, selectedItem.halfPanFeeds);
    const pricing = priceItem(selectedItem, pans, guestsNum);

    const line = {
      id: `${selectedItem.id}_${Date.now()}`,
      itemId: selectedItem.id,
      name: selectedItem.name,
      full: pans.full,
      half: pans.half,
      sell: pricing.sell,
      perPerson: pricing.perPerson
    };

    setLines(prev => [...prev, line]);
  };

  const removeLine = (id) => setLines(prev => prev.filter(l => l.id !== id));

  const clearQuote = () => {
    setLines([]);
    setServiceFee("");
    setDeliveryFee("");
    setLocalTaxPct("");
  };

  const foodTotal = useMemo(() => lines.reduce((t, l) => t + Number(l.sell || 0), 0), [lines]);
  const feesTotal = useMemo(() => sumFees([serviceFee, deliveryFee]), [serviceFee, deliveryFee]);
  const subtotal = foodTotal + feesTotal;

  const localRate = (Number(localTaxPct) || 0) / 100;
  const stateTax = subtotal * STATE_TAX_RATE;
  const localTax = subtotal * localRate;
  const totalDue = subtotal + stateTax + localTax;

  const canAdd = Number.isFinite(guestsNum) && guestsNum > 0 && !!selectedItem;

  return (
    <div className={clientView ? "app app-client" : "app"}>
      <header className="header">
        <div>
          <h1>{clientView ? "Estimated Catering Quote" : "Catering Quote Builder"}</h1>
          <p className="subtle">
            {clientView
              ? "Screenshot and text this quote to your client."
              : "Build a quote by guests, items, fees, and taxes. Round-up pan logic is automatic."}
          </p>
        </div>
        <ClientToggle enabled={clientView} onToggle={() => setClientView(v => !v)} />
      </header>

      <section className="card">
        <label>
          Number of guests
          <input
            type="number"
            min="1"
            inputMode="numeric"
            placeholder="e.g., 85"
            value={guests}
            onChange={e => setGuests(e.target.value)}
          />
        </label>

        <label>
          Menu item
          <MenuSelector menu={menu} value={itemId} onChange={setItemId} />
        </label>

        {!clientView && (
          <p className="subtle">
            Tip: Add multiple items (meat + sides). Each item calculates pans separately.
          </p>
        )}

        <div className="row">
          <button onClick={addItem} disabled={!canAdd}>
            Add Item
          </button>
          <button className="btn-secondary" onClick={clearQuote} disabled={lines.length === 0 && !serviceFee && !deliveryFee && !localTaxPct}>
            Clear
          </button>
        </div>
      </section>

      <section className="card">
        <h2>Items</h2>
        {lines.length === 0 ? (
          <p className="subtle">No items yet. Enter guests and tap “Add Item”.</p>
        ) : (
          <div className="lines">
            {lines.map(line => (
              <QuoteLine
                key={line.id}
                line={line}
                onRemove={() => removeLine(line.id)}
                showPerPerson={!clientView}
              />
            ))}
          </div>
        )}
      </section>

      <section className="card">
        <h2>Fees</h2>
        <div className="grid2">
          <FeeInput label="Service Fee" value={serviceFee} onChange={setServiceFee} />
          <FeeInput label="Delivery Fee" value={deliveryFee} onChange={setDeliveryFee} />
        </div>
      </section>

      <section className="card">
        <h2>Taxes</h2>
        <div className="grid2">
          <div className="taxbox">
            <div className="taxlabel">SC State Tax</div>
            <div className="taxvalue">{(STATE_TAX_RATE * 100).toFixed(2)}%</div>
            <div className="subtle">Applies to subtotal.</div>
          </div>

          <label>
            Local tax % (county + city)
            <input
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              placeholder="optional"
              value={localTaxPct}
              onChange={e => setLocalTaxPct(e.target.value)}
            />
            <span className="subtle">If you don’t know it, leave blank and you can add later.</span>
          </label>
        </div>
      </section>

      <section className="card totals">
        <h2>Totals</h2>

        <div className="totals-row">
          <span>Food total</span><span>{money(foodTotal)}</span>
        </div>
        <div className="totals-row">
          <span>Fees (service + delivery)</span><span>{money(feesTotal)}</span>
        </div>
        <div className="totals-row strong">
          <span>Subtotal</span><span>{money(subtotal)}</span>
        </div>

        <div className="totals-row">
          <span>SC State Tax (6%)</span><span>{money(stateTax)}</span>
        </div>
        <div className="totals-row">
          <span>Local Tax{localTaxPct ? ` (${Number(localTaxPct).toFixed(2)}%)` : ""}</span><span>{money(localTax)}</span>
        </div>

        <div className="totals-row grand">
          <span>Total Due</span><span>{money(totalDue)}</span>
        </div>

        {clientView && (
          <p className="subtle center">
            Prices are estimates and may change based on final headcount, menu choices, and venue requirements.
          </p>
        )}
      </section>

      {!clientView && (
        <footer className="footer subtle">
          Saved automatically on this device. Deploy on Vercel to use from your phone via link.
        </footer>
      )}
    </div>
  );
}
