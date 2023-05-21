import { ApplicationConfig, importProvidersFrom } from "@angular/core"
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions } from "@angular/material/form-field"
import { MAT_ICON_DEFAULT_OPTIONS, MatIconDefaultOptions } from "@angular/material/icon"
import { provideAnimations } from "@angular/platform-browser/animations"
import { provideRouter } from "@angular/router"
import { SupabaseClient } from "@supabase/supabase-js"
import { EventPluginsModule } from "@tinkoff/ng-event-plugins"

import { routes } from "./app.routes"

import { SUPABASE_CLIENT } from "./shared/inject-tokens"

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    {
      provide: SUPABASE_CLIENT,
      useFactory: () => {
        return new SupabaseClient(
          "https://nnfaevrxlahntuzgdgjx.supabase.co",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uZmFldnJ4bGFobnR1emdkZ2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE0Nzk1MDUsImV4cCI6MTk5NzA1NTUwNX0.oSkuyyV9DNF2KayRs1uZvIi2GgvFBFgyYwlWxwbWVyM"
        )
      }
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: "outline"
      } as MatFormFieldDefaultOptions
    },
    {
      provide: MAT_ICON_DEFAULT_OPTIONS,
      useValue: {
        fontSet: "material-icons-outlined"
      } as MatIconDefaultOptions
    },
    importProvidersFrom(EventPluginsModule)
  ]
}
