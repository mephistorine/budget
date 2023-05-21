export type CategoryEmojiIcon = {
  type: "emoji",
  value: string
}

export type CategoryIcon = CategoryEmojiIcon

export type Category = {
  id: string
  user_id: string
  name: string
  description: string | null
  created_at: string
  icon: CategoryIcon
}
