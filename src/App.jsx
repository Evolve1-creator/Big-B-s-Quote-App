import { useEffect, useMemo, useState } from "react";
import menu from "./data/menu.json";
import scTaxes from "./data/scTaxes.json";
import { calculatePans } from "./utils/panCalculator";
import { priceItem } from "./utils/pricingEngine";
import { sumFees } from "./utils/feeEngine";
import MenuSelector from "./components/MenuSelector";
import FeeInput from "./components/FeeInput";
import ClientToggle from "./components/ClientToggle";
import QuoteLine from "./components/QuoteLine";

const LS_KEY = "catering_quote_v2";

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
  const [clientView, setClientView] = useState(false);

  // Tax controls
  const [addTax, setAddTax] = useState(false);
  const [city, setCity] = useState("Columbia");

  const guestsNum = Number(guests);
  const selectedItem = menu.find(m => m.id === itemId);

  const addItem = () => {
    if (!guestsNum || !selectedItem) return;
    const pans = calculatePans(guestsNum, selectedItem.fullPanFeeds, selectedItem.halfPanFeeds);
    const pricing = priceItem(selectedItem, pans, guestsNum);
    setLines(prev => [...prev, {
      id: Date.now(),
      name: selectedItem.name,
      full: pans.full,
      half: pans.half,
      sell: pricing.sell,
      perPerson: pricing.perPerson
    }]);
  };

  const foodTotal = lines.reduce((t, l) => t + l.sell, 0);
  const feesTotal = sumFees([serviceFee, deliveryFee]);
  const subtotal = foodTotal + feesTotal;

  let stateTax = 0, countyTax = 0, cityTax = 0;
  if (addTax) {
    const cityCfg = scTaxes.cities[city];
    stateTax = subtotal * scTaxes.stateRate;
    countyTax = subtotal * cityCfg.countyRate;
    cityTax = subtotal * cityCfg.cityRate;
  }

  const totalDue = subtotal + stateTax + countyTax + cityTax;

  return (
    <div className="app">
      <h1>{clientView ? "Estimated Catering Quote" : "Catering Quote Builder"}</h1>

      <input type="number" placeholder="Number of guests" value={guests} onChange={e => setGuests(e.target.value)} />
      <MenuSelector menu={menu} value={itemId} onChange={setItemId} />
      <button onClick={addItem}>Add Item</button>

      {lines.map(l => <QuoteLine key={l.id} line={l} showPerPerson={!clientView} />)}

      <FeeInput label="Service Fee" value={serviceFee} onChange={setServiceFee} />
      <FeeInput label="Delivery Fee" value={deliveryFee} onChange={setDeliveryFee} />

      <label>
        <input type="checkbox" checked={addTax} onChange={() => setAddTax(v => !v)} />
        Add Sales Tax
      </label>

      {addTax && (
        <label>
          City
          <select value={city} onChange={e => setCity(e.target.value)}>
            {Object.keys(scTaxes.cities).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
      )}

      <ClientToggle enabled={clientView} onToggle={() => setClientView(v => !v)} />

      <div className="totals">
        <div>Subtotal: {money(subtotal)}</div>
        {addTax && (
          <>
            <div>SC State Tax: {money(stateTax)}</div>
            <div>County Tax: {money(countyTax)}</div>
            <div>City Tax: {money(cityTax)}</div>
          </>
        )}
        <strong>Total Due: {money(totalDue)}</strong>
      </div>
    </div>
  );
}
