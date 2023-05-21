import { CommonModule } from "@angular/common"
import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from "@angular/core"
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms"
import { MatButtonModule } from "@angular/material/button"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatInputModule } from "@angular/material/input"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"
import { Router, RouterLink } from "@angular/router"

import { SUPABASE_CLIENT } from "@bdgt/shared/inject-tokens"
import { SupabaseClient } from "@supabase/supabase-js"

@Component({
  selector: "bu-login-page",
  standalone: true,
  imports: [ CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink, ReactiveFormsModule, MatSnackBarModule ],
  templateUrl: "./login-page.component.html",
  styleUrls: [ "./login-page.component.css" ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  // region DI injects
  private formBuilder: FormBuilder = inject(FormBuilder)

  private matSnackBar: MatSnackBar = inject(MatSnackBar)

  private router: Router = inject(Router)

  private supabaseClient: SupabaseClient = inject(SUPABASE_CLIENT)
  // endregion

  protected isLoading: WritableSignal<boolean> = signal(false)

  protected form = this.formBuilder.group({
    email: this.formBuilder.control<string>("", [ Validators.required, Validators.email ]),
    password: this.formBuilder.control<string>("", Validators.required)
  })

  public async onSubmitForm(): Promise<void> {
    if (this.form.invalid || this.isLoading()) {
      return
    }

    this.isLoading.set(true)

    const formValue = this.form.value

    const { error } = await this.supabaseClient.auth.signInWithPassword({
      email: formValue.email!,
      password: formValue.password!
    })

    this.isLoading.set(false)

    if (error === null) {
      this.router.navigateByUrl("/")
    } else {
      this.matSnackBar.open("Login error")
      console.error(error)
    }
  }
}
