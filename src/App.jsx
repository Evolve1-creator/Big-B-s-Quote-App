import { useState } from "react";
import menu from "./data/menu.json";
import { calculatePans } from "./utils/panCalculator";
import { priceItem } from "./utils/pricingEngine";
import { sumFees } from "./utils/feeEngine";
import MenuSelector from "./components/MenuSelector";
import FeeInput from "./components/FeeInput";
import ClientToggle from "./components/ClientToggle";
import QuoteLine from "./components/QuoteLine";

export default function App() {
  const [guests, setGuests] = useState("");
  const [itemId, setItemId] = useState(menu[0].id);
  const [serviceFee, setServiceFee] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");
  const [clientView, setClientView] = useState(false);

  const guestsNum = Number(guests);
  const item = menu.find(m => m.id === itemId);

  let pans = { full: 0, half: 0 };
  let pricing = { sell: 0, perPerson: 0 };

  if (guestsNum > 0) {
    pans = calculatePans(guestsNum, item.fullPanFeeds, item.halfPanFeeds);
    pricing = priceItem(item, pans, guestsNum);
  }

  const fees = sumFees([serviceFee, deliveryFee]);
  const total = pricing.sell + fees;

  return (
    <div className="app">
      <h1>Catering Quote</h1>

      <input
        type="number"
        placeholder="Number of guests"
        value={guests}
        onChange={e => setGuests(e.target.value)}
      />

      <MenuSelector menu={menu} value={itemId} onChange={setItemId} />

      {guestsNum > 0 && (
        <QuoteLine item={item} pans={pans} total={pricing.sell} />
      )}

      <FeeInput label="Service Fee" value={serviceFee} onChange={setServiceFee} />
      <FeeInput label="Delivery Fee" value={deliveryFee} onChange={setDeliveryFee} />

      <ClientToggle enabled={clientView} onToggle={() => setClientView(v => !v)} />

      <h2>Total: ${total.toFixed(2)}</h2>

      {!clientView && guestsNum > 0 && (
        <p>${pricing.perPerson} per person</p>
      )}
    </div>
  );
}