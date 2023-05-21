import { CommonModule } from "@angular/common"
import { ChangeDetectionStrategy, Component, inject } from "@angular/core"
import { ReactiveFormsModule } from "@angular/forms"
import { MatButtonToggleModule } from "@angular/material/button-toggle"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatIconModule } from "@angular/material/icon"
import { MatInputModule } from "@angular/material/input"
import { MatListModule } from "@angular/material/list"
import { RouterLink } from "@angular/router"
import { Category, CategoryIcon, Transaction, TransactionKind } from "@bdgt/shared/domain"
import { SUPABASE_CLIENT } from "@bdgt/shared/inject-tokens"
import { BdgtSupabaseDatabase } from "@bdgt/shared/models"
import { SupabaseClient } from "@supabase/supabase-js"
import { differenceInDays, format, parse } from "date-fns"
import { forkJoin, map, Observable, shareReplay } from "rxjs"

type TransactionGroupItem = {
  id: string
  createdAt: string
  categoryName: string | null
  icon: CategoryIcon | null
  amount: string
  transactionKind: TransactionKind
}

type TransactionGroup = {
  date: string
  transactions: readonly TransactionGroupItem[]
}

@Component({
  selector: "bu-home-page",
  standalone: true,
  imports: [ CommonModule, RouterLink, MatButtonToggleModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatListModule ],
  templateUrl: "./home-page.component.html",
  styleUrls: [ "./home-page.component.css" ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  // region DI Injects
  private supabaseClient: SupabaseClient<BdgtSupabaseDatabase> = inject(SUPABASE_CLIENT)

  // endregion

  protected transactions: Observable<readonly TransactionGroup[]> = forkJoin([
    this.supabaseClient.from("transactions").select(),
    this.supabaseClient.from("categories").select()
  ]).pipe(
    map(([ { data: transactions }, { data: categories } ]) => {
      return [ transactions ?? [], categories ?? [] ] as any
    }),
    map(([ transactions, categories ]: [ Transaction[], Category[] ]) => {
      const categoriesById: Map<string, Category> = new Map(categories.map((category) => [ category.id, category ]))
      const transactionsByDay: Map<string, TransactionGroupItem[]> = new Map()

      const formedTransactions: readonly TransactionGroupItem[] = transactions.map((transaction) => {
        const result: TransactionGroupItem = {
          id: transaction.id,
          createdAt: transaction.created_at,
          categoryName: null,
          icon: null,
          amount: ((transaction.kind === "EXPENSE" ? transaction.amount * -1 : transaction.amount) / 100).toLocaleString("en", { signDisplay: "exceptZero" }),
          transactionKind: transaction.kind
        }

        if (transaction.category_id !== null) {
          const category: Category | undefined = categoriesById.get(transaction.category_id)

          if (typeof category !== "undefined") {
            result.categoryName = category.name
            result.icon = category.icon
          }
        }

        return result
      })

      for (const transaction of formedTransactions) {
        const dayKey = format(new Date(transaction.createdAt), "yyyy-MM-dd")
        if (transactionsByDay.has(dayKey)) {
          transactionsByDay.get(dayKey)!.push(transaction)
        } else {
          transactionsByDay.set(dayKey, [ transaction ])
        }
      }

      const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

      return Array.from(transactionsByDay.entries()).map(([ day, transactions ]) => {
        const curr = parse(day, "yyyy-MM-dd", new Date())
        const dayDiff = differenceInDays(curr, new Date())
        return {
          date: dayDiff >= -1 ? rtf.format(dayDiff, "day") : curr.toLocaleString("en-EN", {
            dateStyle: "long"
          }),
          transactions
        }
      })
    }),
    shareReplay(1)
  )
}
