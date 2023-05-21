import { TestBed } from "@angular/core/testing"
import { CanActivateFn } from "@angular/router"

import { canOpenAppGuard } from "./can-open-app.guard"

describe("canOpenAppGuard", () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => canOpenAppGuard(...guardParameters))

  beforeEach(() => {
    TestBed.configureTestingModule({})
  })

  it("should be created", () => {
    expect(executeGuard).toBeTruthy()
  })
})
