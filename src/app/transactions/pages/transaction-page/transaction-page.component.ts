import { CommonModule } from "@angular/common"
import { ChangeDetectionStrategy, Component, inject } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { Transaction } from "@bdgt/shared/domain"
import { SUPABASE_CLIENT } from "@bdgt/shared/inject-tokens"
import { SupabaseClient } from "@supabase/supabase-js"
import { map, Observable, of, switchMap } from "rxjs"

@Component({
  selector: "bu-transaction-page",
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: "./transaction-page.component.html",
  styleUrls: [ "./transaction-page.component.css" ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionPageComponent {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute)

  private supabaseClient: SupabaseClient = inject(SUPABASE_CLIENT)

  private transaction: Observable<Transaction> = this.activatedRoute.params.pipe(
    switchMap((params) => this.supabaseClient.from("transactions").select().eq("id", params[ "id" ])),
    map((response: any) => response.data[ 0 ] as Transaction)
  )

  protected title = this.transaction.pipe(
    map((transaction) => {
      return ((transaction.kind === "EXPENSE" ? transaction.amount * -1 : transaction.amount) / 100).toLocaleString("en", { signDisplay: "exceptZero" })
    })
  )

  protected category: Observable<string> = this.transaction.pipe(
    switchMap((transaction) => {
      if (transaction.category_id === null) {
        return of("Empty")
      }

      return this.supabaseClient
        .from("categories")
        .select()
        .eq("id", transaction.category_id)
        .then(({ data }) => {
          return data![ 0 ]["name"]
        })
    })
  )

  protected createDate = this.transaction.pipe(
    map((transaction) => {
      return new Date(transaction.created_at).toLocaleString("en", { dateStyle: "long" })
    })
  )
}
