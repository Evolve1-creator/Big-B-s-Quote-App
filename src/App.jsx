import { useEffect, useMemo, useState } from "react";
import menu from "./data/menu.json";
import scTaxTable from "./data/scTaxTable.json";
import ItemChecklist from "./components/ItemChecklist";
import TaxSelector from "./components/TaxSelector";
import ClientSummary from "./components/ClientSummary";
import { money } from "./utils/money";
import { computeLine, computeTaxes } from "./utils/calcEngine";

const LS_KEY = "bb_catering_quote_v2";

export default function App() {
  const [people, setPeople] = useState("");
  const [selected, setSelected] = useState({});

  const [addTax, setAddTax] = useState(false);
  const [county, setCounty] = useState("");
  const [city, setCity] = useState("");

  const [clientView, setClientView] = useState(false);
  const [clientName, setClientName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [page, setPage] = useState(window.location.hash === "#/receipt" ? "receipt" : "builder");

  // load saved state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      setPeople(s.people ?? "");
      setSelected(s.selected ?? {});
      setAddTax(!!s.addTax);
      setCounty(s.county ?? "");
      setCity(s.city ?? "");
      setClientView(!!s.clientView);
      setClientName(s.clientName ?? "");
      setEventDate(s.eventDate ?? "");
    } catch {}
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ people, selected, addTax, county, city, clientView, clientName, eventDate }));
    } catch {}
  }, [people, selected, addTax, county, city, clientView, clientName, eventDate]);


  useEffect(() => {
    // Receipt page is always client-safe view
    setClientView(page === "receipt");
  }, [page]);


  const p = Number(people);

  const selectedItems = useMemo(() => {
    return menu.filter(it => !!selected[it.id]);
  }, [selected]);

  const lines = useMemo(() => {
    // compute in the same order as menu definition
    return selectedItems.map(it => {
      const calc = computeLine(it, p);
      return {
        id: it.id,
        name: it.name,
        category: it.category,
        pricingType: it.pricingType,
        qtyDisplay: calc.qtyDisplay,
        unitPrice: calc.unitPrice,
        lineTotal: calc.lineTotal
      };
    });
  }, [selectedItems, p]);

  const subtotal = useMemo(() => lines.reduce((t, l) => t + Number(l.lineTotal || 0), 0), [lines]);

  const taxes = useMemo(() => {
    if (!addTax) return { stateTax: 0, countyTax: 0, hospitalityTax: 0, totalTax: 0 };
    if (!county || !city) return { stateTax: 0, countyTax: 0, hospitalityTax: 0, totalTax: 0 };
    return computeTaxes(subtotal, scTaxTable, county, city);
  }, [addTax, county, city, subtotal]);

  const totalDue = subtotal + taxes.totalTax;

  const toggleItem = (id) => {
    setSelected(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const clearAll = () => {
    setSelected({});
  };


  const resetQuote = () => {
    try {
      localStorage.removeItem(LS_KEY);
    } catch {}
    setPeople("");
    setSelected({});
    setAddTax(false);
    setCounty("");
    setCity("");
    setClientView(false);
    setClientName("");
    setEventDate("");
  };


  return (
    <div className="app">
      
<header className="topbar">
  <div className="brandwrap">
    <img src="/logo.png" alt="Big B’s BBQ Catering logo" className="logo" />
    <div>
      <div className="brand">Big B’s Catering Quotes</div>
      <div className="subtle">Enter headcount, check items, and generate a client-ready summary.</div>
    </div>
  </div>
  
</header>


      <div className="card">
        <div className="grid2">
          <label>
            Client name
            <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Client name" />
          </label>
          <label>
            Event date
            <input value={eventDate} onChange={e => setEventDate(e.target.value)} placeholder="MM/DD/YYYY" />
          </label>
        </div>

        <label>
          Number of people
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="e.g., 85"
            value={people}
            onChange={e => setPeople(e.target.value)}
          />
        </label>

        
        <div className="row">
          <button className="btn-secondary" type="button" onClick={clearAll}>Clear selections</button>
          <button className="btn-secondary" type="button" onClick={resetQuote}>Reset quote</button>
          <button type="button" onClick={() => setPage("receipt")} disabled={page==="receipt"}>Receipt</button>
        </div>

      </div>

      <ItemChecklist items={menu} selectedMap={selected} onToggle={toggleItem} />

      <TaxSelector
        addTax={addTax}
        setAddTax={setAddTax}
        county={county}
        setCounty={setCounty}
        city={city}
        setCity={setCity}
        taxTable={scTaxTable}
      />

      {page === "builder" ? (
        <div className="card">
          <h2>Internal Quote</h2>
          {lines.length === 0 ? (
            <div className="subtle">Select items to see totals.</div>
          ) : (
            <div className="lines">
              {lines.map(l => (
                <div key={l.id} className="line">
                  <div className="line-left">
                    <div className="line-name">{l.name}</div>
                    <div className="subtle">{l.qtyDisplay}</div>
                  </div>
                  <div className="line-right">{money(l.lineTotal)}</div>
                </div>
              ))}
            </div>
          )}

          <div className="totals">
            <div className="totals-row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            {addTax && county && city && (
              <>
                <div className="totals-row"><span>SC State Tax</span><span>{money(taxes.stateTax)}</span></div>
                <div className="totals-row"><span>{county} County Tax</span><span>{money(taxes.countyTax)}</span></div>
                <div className="totals-row"><span>Hospitality Tax ({city})</span><span>{money(taxes.hospitalityTax)}</span></div>
              </>
            )}
            <div className="totals-row grand"><span>Total Due</span><span>{money(totalDue)}</span></div>
          </div>
        </div>
      ) : (
        <div className="card">
          <button type="button" onClick={() => setPage("receipt")}>
            View Receipt
          </button>
        </div>

        <ClientSummary
          clientName={clientName}
          setClientName={setClientName}
          eventDate={eventDate}
          setEventDate={setEventDate}
          lines={lines}
          taxTotal={taxes.totalTax}
          totalDue={totalDue}
        />
      )}

      <footer className="footer subtle">
        Deploy on Vercel to open from a link on your phone. Data is editable in <code>src/data/menu.json</code> and <code>src/data/scTaxTable.json</code>.
      </footer>
    </div>
  );
}
