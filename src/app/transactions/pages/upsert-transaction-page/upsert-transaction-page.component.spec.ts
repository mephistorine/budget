import { ComponentFixture, TestBed } from "@angular/core/testing"

import { UpsertTransactionPageComponent } from "./upsert-transaction-page.component"

describe("UpsertTransactionPageComponent", () => {
  let component: UpsertTransactionPageComponent
  let fixture: ComponentFixture<UpsertTransactionPageComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ UpsertTransactionPageComponent ]
    })
    fixture = TestBed.createComponent(UpsertTransactionPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })
})
