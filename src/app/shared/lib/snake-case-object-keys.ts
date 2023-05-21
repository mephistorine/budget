import { snakeCaseIt } from "case-it"

export function snakeCaseObjectKeys<T extends object>(target: T): T {
  return Object.fromEntries(
    Object.entries(target)
      .map(([ key, value ]) => [ snakeCaseIt(key), value ])
  ) as any
}
