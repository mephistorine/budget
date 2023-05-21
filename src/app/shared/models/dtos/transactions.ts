import { Transaction } from "@bdgt/shared/domain"

export type TransactionCreateDto = Omit<Transaction, "id" | "created_at">
