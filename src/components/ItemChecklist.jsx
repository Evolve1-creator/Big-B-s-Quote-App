import { useMemo } from "react";

export default function ItemChecklist({ items, selectedMap, onToggle }) {
  const grouped = useMemo(() => {
    const g = {};

    const visibleItems = (items || []).filter((it) => {
      // Items marked as on-site only should only appear when Onsite Service is selected
      if (it?.requiresOnsite && !selectedMap?.onsite_service) return false;
      return true;
    });

    for (const it of visibleItems) {
      const cat = it.category || "Other";
      if (!g[cat]) g[cat] = [];
      g[cat].push(it);
    }

    // stable order inside categories
    Object.values(g).forEach((arr) => arr.sort((a, b) => a.name.localeCompare(b.name)));
    return g;
  }, [items, selectedMap]);

  const catOrder = ["Meats", "Sandwiches", "Sides", "Breads", "Desserts", "Drinks & Extras", "Other"];

  const orderedCats = Object.keys(grouped).sort((a, b) => {
    const ia = catOrder.indexOf(a);
    const ib = catOrder.indexOf(b);
    const ra = ia === -1 ? 999 : ia;
    const rb = ib === -1 ? 999 : ib;
    return ra - rb || a.localeCompare(b);
  });

  return (
    <div className="card">
      <h2>Select Items</h2>
      <p className="subtle">Check what the client wants. Quantities and pricing calculate automatically from the headcount.</p>

      {orderedCats.map((cat) => (
        <div key={cat} className="cat">
          <div className="cat-title">{cat}</div>
          <div className="checks">
            {grouped[cat].map((it) => {
              const checked = !!selectedMap[it.id];
              return (
                <label key={it.id} className={checked ? "check checked" : "check"}>
                  <input type="checkbox" checked={checked} onChange={() => onToggle(it.id)} />
                  <span className="checkname">{it.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
