export type TransactionKind = "EXPENSE" | "INCOME"

export type Transaction = {
  id: string
  user_id: string
  category_id: string | null
  created_at: string
  kind: TransactionKind
  amount: number
  description: string | null
}
