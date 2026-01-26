
import { useEffect, useMemo, useState } from "react";
import ItemChecklist from "./components/ItemChecklist";
import ClientSummary from "./components/ClientSummary";
import menu from "./data/menu.json";

const LS_KEY = "bb_catering_quote_v3";

export default function App() {
  const [page, setPage] = useState(
    window.location.hash === "#/receipt" ? "receipt" : "builder"
  );

  const [people, setPeople] = useState("");
  const [selected, setSelected] = useState({});
  const [clientName, setClientName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [addTax, setAddTax] = useState(false);
  const [county, setCounty] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({ people, selected, clientName, eventDate, addTax, county, city })
    );
  }, [people, selected, clientName, eventDate, addTax, county, city]);

  useEffect(() => {
    window.location.hash = page === "receipt" ? "#/receipt" : "#/builder";
  }, [page]);

  const toggleItem = (id) =>
    setSelected((s) => ({ ...s, [id]: !s[id] }));

  const resetQuote = () => {
    localStorage.removeItem(LS_KEY);
    setPeople("");
    setSelected({});
    setClientName("");
    setEventDate("");
    setAddTax(false);
    setCounty("");
    setCity("");
    setPage("builder");
  };

  const selectedItems = useMemo(
    () => menu.filter((m) => selected[m.id]),
    [selected]
  );

  if (page === "receipt") {
    return (
      <ClientSummary
        clientName={clientName}
        eventDate={eventDate}
        items={selectedItems}
        people={people}
        addTax={addTax}
        phone="803-600-5386"
        onBack={() => setPage("builder")}
      />
    );
  }

  return (
    <div className="container">
      <h1>Big B’s BBQ Catering Quote</h1>

      <div className="card">
        <label>
          Client name
          <input value={clientName} onChange={(e) => setClientName(e.target.value)} />
        </label>
        <label>
          Event date
          <input value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
        </label>
        <label>
          Number of people
          <input
            type="number"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
          />
        </label>
      </div>

      <ItemChecklist items={menu} selectedMap={selected} onToggle={toggleItem} />


      <div className="card">
        <h2>Selected Items (Internal)</h2>
        {selectedItems.length === 0 ? (
          <p className="subtle">No items selected.</p>
        ) : (
          <ul className="summary-list">
            {selectedItems.map(it => (
              <li key={it.id}>
                <span>{it.name}</span>
                {it.price != null && <span>${it.price.toFixed(2)}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>


      <div className="card">
        <button onClick={() => setPage("receipt")}>View Receipt</button>
        <button className="btn-secondary" onClick={resetQuote}>
          Reset Quote
        </button>
      </div>
    </div>
  );
}
