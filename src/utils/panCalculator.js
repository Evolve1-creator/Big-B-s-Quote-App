export function calculatePans(guests, fullFeeds, halfFeeds) {
  let full = Math.floor(guests / fullFeeds);
  let remainder = guests - full * fullFeeds;

  if (remainder <= 0) return { full, half: 0 };

  if (remainder <= halfFeeds) return { full, half: 1 };

  const halfNeeded = Math.ceil(remainder / halfFeeds);
  return halfNeeded * halfFeeds < fullFeeds
    ? { full, half: halfNeeded }
    : { full: full + 1, half: 0 };
}