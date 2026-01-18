export function roundUpToHalfLb(lbs) {
  // Always round UP to nearest 0.5
  return Math.ceil(Number(lbs || 0) * 2) / 2;
}
