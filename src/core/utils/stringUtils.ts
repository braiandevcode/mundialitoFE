export function stripNonDigits(v: string): string {
  return v.replace(/\D/g, '')
}
