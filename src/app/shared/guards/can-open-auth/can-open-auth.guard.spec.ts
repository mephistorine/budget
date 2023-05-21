import { TestBed } from "@angular/core/testing"
import { CanActivateFn } from "@angular/router"

import { canOpenAuthGuard } from "./can-open-auth.guard"

describe("canOpenAuthGuard", () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => canOpenAuthGuard(...guardParameters))

  beforeEach(() => {
    TestBed.configureTestingModule({})
  })

  it("should be created", () => {
    expect(executeGuard).toBeTruthy()
  })
})
