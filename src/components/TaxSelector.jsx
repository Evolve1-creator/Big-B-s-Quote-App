export default function TaxSelector({ addTax, setAddTax, county, setCounty, city, setCity, taxTable }) {
  const counties = Object.keys(taxTable?.counties || {});
  const cities = county ? Object.keys(taxTable?.counties?.[county]?.cities || {}) : [];

  return (
    <div className="card">
      <h2>Sales Tax</h2>

      <label className="inline">
        <input type="checkbox" checked={addTax} onChange={() => setAddTax(v => !v)} />
        <span>Add Sales Tax</span>
      </label>

      {addTax && (
        <div className="grid2">
          <label>
            County
            <select value={county} onChange={e => { setCounty(e.target.value); setCity(""); }}>
              <option value="">Select county</option>
              {counties.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          <label>
            City
            <select value={city} disabled={!county} onChange={e => setCity(e.target.value)}>
              <option value="">Select city</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>
      )}
    </div>
  );
}
