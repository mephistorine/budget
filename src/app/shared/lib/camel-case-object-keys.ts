import { camelCaseIt } from "case-it"

export function camelCaseKeys<T extends object>(target: T): T {
  return Object.fromEntries(
    Object.entries(target)
      .map(([ key, value ]) => [ camelCaseIt(key), value ])
  ) as any
}
