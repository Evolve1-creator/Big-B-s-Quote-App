export function sumFees(fees) {
  return fees.reduce((t, f) => t + Number(f || 0), 0);
}