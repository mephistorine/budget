import { Category, Transaction } from "@bdgt/shared/domain"
import { TransactionCreateDto } from "@bdgt/shared/models/dtos"

export type BdgtSupabaseDatabase = {
  public: {
    Tables: {
      transactions: {
        Row: Transaction,
        Insert: TransactionCreateDto,
        Update: Transaction
      },
      categories: {
        Row: Category,
        Insert: Category,
        Update: Category
      }
    }
  }
}
