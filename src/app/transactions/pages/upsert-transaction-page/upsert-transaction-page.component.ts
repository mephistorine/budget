import { CommonModule, Location } from "@angular/common"
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal, Signal, WritableSignal } from "@angular/core"
import { toSignal } from "@angular/core/rxjs-interop"
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button"
import { MatButtonToggleModule } from "@angular/material/button-toggle"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatRadioModule } from "@angular/material/radio"
import { MatSelectModule } from "@angular/material/select"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { ActivatedRoute } from "@angular/router"
import { Category, TransactionKind } from "@bdgt/shared/domain"
import { SUPABASE_CLIENT } from "@bdgt/shared/inject-tokens"
import { BdgtSupabaseDatabase, TransactionCreateDto } from "@bdgt/shared/models"
import { LOCAL_STORAGE } from "@ng-web-apis/common"
import { SupabaseClient } from "@supabase/supabase-js"
import { map } from "rxjs"

type UpsertTransactionRouteMode = "CREATE" | "UPDATE"

@Component({
  selector: "bu-upsert-transaction-page",
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, MatFormFieldModule, MatRadioModule, MatInputModule, MatButtonToggleModule, MatSelectModule, MatButtonModule, MatSnackBarModule ],
  templateUrl: "./upsert-transaction-page.component.html",
  styleUrls: [ "./upsert-transaction-page.component.css" ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpsertTransactionPageComponent implements OnDestroy, OnInit {
  // region DI Injects
  private formBuilder: FormBuilder = inject(FormBuilder)

  private activatedRoute: ActivatedRoute = inject(ActivatedRoute)

  private supabaseClient: SupabaseClient<BdgtSupabaseDatabase> = inject(SUPABASE_CLIENT)

  private matSnackBar: MatSnackBar = inject(MatSnackBar)

  private location: Location = inject(Location)

  private localStorage: Storage = inject(LOCAL_STORAGE)
  // endregion

  protected form = this.formBuilder.group({
    kind: this.formBuilder.control<TransactionKind>("EXPENSE", Validators.required),
    amount: this.formBuilder.control<number>(0, Validators.min(0)),
    categoryId: this.formBuilder.control<string | null>(null),
    description: this.formBuilder.control<string | null>(null)
  })

  protected upsertMode: Signal<UpsertTransactionRouteMode> = toSignal<UpsertTransactionRouteMode>(
    this.activatedRoute.data.pipe(map((data) => data[ "mode" ])),
    { requireSync: true }
  )

  protected transactionIdToUpdate: Signal<string | null> = toSignal(
    this.activatedRoute.params.pipe(map((params) => params[ "id" ] ?? null)),
    { requireSync: true }
  )

  protected isLoading: WritableSignal<boolean> = signal(false)

  protected categories: Promise<Category[]> = this.supabaseClient
    .from("categories")
    .select()
    .then((response) => {
      if (response.error !== null) {
        console.error(response.error)
        return []
      }

      return response.data
    }) as Promise<Category[]>

  constructor() {
    console.debug(this.upsertMode())
    console.debug(this.transactionIdToUpdate())
  }

  public ngOnDestroy(): void {
    const formValue = this.form.value
    this.localStorage.setItem("upsert-transaction-form-cache", JSON.stringify(formValue))
  }

  public ngOnInit(): void {
    const formCache: string | null = this.localStorage.getItem("upsert-transaction-form-cache")

    if (typeof formCache === "string") {
      try {
        this.form.patchValue(JSON.parse(formCache))
      } catch (error) {
        console.error(error)
      }
    }
  }

  public async onSubmitForm(): Promise<void> {
    if (this.form.invalid) {
      return
    }

    if (this.isLoading()) {
      return
    }

    const { data } = await this.supabaseClient.auth.getUser()

    if (data.user === null) {
      return
    }

    const formValue = this.form.value

    const transaction: TransactionCreateDto = {
      amount: formValue.amount! * 100,
      category_id: formValue.categoryId!,
      description: formValue.description!,
      kind: formValue.kind!,
      user_id: data.user.id,
    }

    const transactionResponse = await this.supabaseClient.from("transactions").insert(transaction)

    if (transactionResponse.error === null) {
      this.matSnackBar.open("Transaction successfully created")
      this.localStorage.removeItem("upsert-transaction-form-cache")
      this.location.back()
    } else {
      this.matSnackBar.open("Transaction create error")
    }
  }
}
