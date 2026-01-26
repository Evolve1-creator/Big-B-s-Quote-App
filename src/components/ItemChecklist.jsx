import { useMemo } from "react";

export default function ItemChecklist({ items, selectedMap, onToggle }) {
  const leftCats = new Set(["Meats", "Sides"]);
  const rightCats = new Set(["Sandwiches", "Breads", "Desserts", "Drinks & Extras", "Other"]);

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

  const left = [];
  const right = [];

  Object.entries(grouped).forEach(([cat, arr]) => {
    if (leftCats.has(cat)) left.push({ cat, arr });
    else right.push({ cat, arr });
  });

  return (
    <div className="card">
      <h2>Select Items</h2>
      <p className="subtle">Each item is on its own row. Meats & sides on the left; everything else on the right.</p>

      <div className="two-col">
        <div className="col">
          {left.map(({cat, arr}) => (
            <div key={cat} className="category">
              <div className="category-title">{cat}</div>
              {arr.map(it => (
                <label key={it.id} className={"checkrow" + (selectedMap[it.id] ? " checked" : "")}>
                  <input
                    type="checkbox"
                    checked={!!selectedMap[it.id]}
                    onChange={() => onToggle(it.id)}
                  />
                  <span className="checkname">{it.name}</span>
                </label>
              ))}
            </div>
          ))}
        </div>

        <div className="col">
          {right.map(({cat, arr}) => (
            <div key={cat} className="category">
              <div className="category-title">{cat}</div>
              {arr.map(it => (
                <label key={it.id} className={"checkrow" + (selectedMap[it.id] ? " checked" : "")}>
                  <input
                    type="checkbox"
                    checked={!!selectedMap[it.id]}
                    onChange={() => onToggle(it.id)}
                  />
                  <span className="checkname">{it.name}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}