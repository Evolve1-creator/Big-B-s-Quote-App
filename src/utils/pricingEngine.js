export function priceItem(item, pans, guests) {
  const sell =
    pans.full * item.fullPanPrice +
    pans.half * item.halfPanPrice;

  return {
    sell,
    perPerson: +(sell / guests).toFixed(2)
  };
}