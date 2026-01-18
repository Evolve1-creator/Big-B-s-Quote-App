import { roundUpToHalfLb } from "./rounding";

export const MEAT_LB_PER_PERSON = 1 / 3.5; // locked rule

export const DEFAULT_HALF_PAN_FEEDS = 25; // used for sides/desserts unless overridden

export function computeLine(item, people) {
  const p = Number(people || 0);
  const type = item.pricingType;

  if (!p || p <= 0) {
    // Allow flat items (like delivery) without people
    if (type === "flat") {
      return {
        qtyLabel: "flat",
        qtyValue: 1,
        qtyDisplay: "1",
        unitPrice: Number(item.flatPrice || 0),
        lineTotal: Number(item.flatPrice || 0)
      };
    }
    return { qtyLabel: "", qtyValue: 0, qtyDisplay: "", unitPrice: 0, lineTotal: 0 };
  }

  if (type === "per_lb") {
    const rawLbs = p * MEAT_LB_PER_PERSON;
    const lbs = roundUpToHalfLb(rawLbs);
    const unit = Number(item.pricePerLb || 0);
    return {
      qtyLabel: "lb",
      qtyValue: lbs,
      qtyDisplay: `${lbs.toFixed(1)} lb`,
      unitPrice: unit,
      lineTotal: lbs * unit
    };
  }

  if (type === "per_each") {
    const qty = Math.ceil(p); // default: 1 per person
    const unit = Number(item.priceEach || 0);
    return {
      qtyLabel: "each",
      qtyValue: qty,
      qtyDisplay: `${qty}`,
      unitPrice: unit,
      lineTotal: qty * unit
    };
  }

  if (type === "per_person") {
    const qty = Math.ceil(p);
    const unit = Number(item.pricePerPerson || 0);
    return {
      qtyLabel: "person",
      qtyValue: qty,
      qtyDisplay: `${qty} people`,
      unitPrice: unit,
      lineTotal: qty * unit
    };
  }

  if (type === "half_pan") {
    const feeds = Number(item.halfPanFeeds || DEFAULT_HALF_PAN_FEEDS);
    const halfPans = Math.ceil(p / feeds); // round up to whole 1/2 pan units
    const unit = Number(item.halfPanPrice || 0);
    return {
      qtyLabel: "half_pan",
      qtyValue: halfPans,
      qtyDisplay: `${halfPans} × 1/2 pan`,
      unitPrice: unit,
      lineTotal: halfPans * unit
    };
  }

  if (type === "flat") {
    const unit = Number(item.flatPrice || 0);
    return {
      qtyLabel: "flat",
      qtyValue: 1,
      qtyDisplay: "1",
      unitPrice: unit,
      lineTotal: unit
    };
  }

  return { qtyLabel: "", qtyValue: 0, qtyDisplay: "", unitPrice: 0, lineTotal: 0 };
}

export function computeTaxes(taxableAmount, taxTable, county, city) {
  const base = Number(taxableAmount || 0);
  if (!base || base <= 0) return { stateTax: 0, countyTax: 0, hospitalityTax: 0, totalTax: 0 };

  const stateRate = Number(taxTable?.stateRate || 0);
  const c = taxTable?.counties?.[county];
  const countyRate = Number(c?.countyRate || 0);
  const hospitalityRate = Number(c?.cities?.[city]?.hospitalityRate || 0);

  const stateTax = base * stateRate;
  const countyTax = base * countyRate;
  const hospitalityTax = base * hospitalityRate;

  return {
    stateTax,
    countyTax,
    hospitalityTax,
    totalTax: stateTax + countyTax + hospitalityTax
  };
}
