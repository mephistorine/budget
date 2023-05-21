import { inject } from "@angular/core"
import { CanActivateFn, Router } from "@angular/router"
import { SUPABASE_CLIENT } from "@bdgt/shared/inject-tokens"
import { SupabaseClient } from "@supabase/supabase-js"

export const canOpenAuthGuard: CanActivateFn = async () => {
  const supabaseClient: SupabaseClient = inject(SUPABASE_CLIENT)
  const router: Router = inject(Router)
  const { data } = await supabaseClient.auth.getUser()
  const canOpen: boolean = data.user === null

  if (!canOpen) {
    return router.parseUrl("/")
  }

  return true
}
