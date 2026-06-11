type TClassInput = string | false | null | undefined

/**
 * Merges class names, filtering out falsy values.
 * Lightweight alternative to clsx for our use case.
 */
export function cn(...classes: TClassInput[]): string {
  return classes.filter(Boolean).join(' ')
}
