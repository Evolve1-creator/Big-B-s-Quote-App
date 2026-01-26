import { useMemo } from "react";

export default function ItemChecklist({ items, selectedMap, onToggle }) {
  const grouped = useMemo(() => {
    const g = {};
    for (const it of items) {
      const cat = it.category || "Other";
      if (!g[cat]) g[cat] = [];
      g[cat].push(it);
    }
    Object.values(g).forEach(arr => arr.sort((a,b) => a.name.localeCompare(b.name)));
    return g;
  }, [items]);

  const catOrder = ["Meats","Sandwiches","Sides","Breads","Desserts","Drinks & Extras","Other"];

  const orderedCats = Object.keys(grouped).sort((a,b) => {
    const ia = catOrder.indexOf(a);
    const ib = catOrder.indexOf(b);
    const ra = ia === -1 ? 999 : ia;
    const rb = ib === -1 ? 999 : ib;
    return ra - rb || a.localeCompare(b);
  });

  return (
    <div className="card">
      <h2>Select Items</h2>
      <p className="subtle">Tap the checkbox next to each item.</p>

      {orderedCats.map(cat => (
        <div key={cat} className="category">
          <div className="category-title">{cat}</div>
          <div className="checkgrid">
            {grouped[cat].map(it => {
              const checked = !!selectedMap[it.id];
              return (
                <label key={it.id} className={"checkrow" + (checked ? " checked" : "")}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(it.id)}
                  />
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