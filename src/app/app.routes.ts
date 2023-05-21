import { Routes } from "@angular/router"
import { canOpenAppGuard, canOpenAuthGuard } from "@bdgt/shared/guards"
import { HomePageComponent } from "./home/pages/home-page/home-page.component"

export const routes: Routes = [
  {
    title: "Login",
    path: "auth/login",
    loadComponent: () => import("./auth/pages/login-page/login-page.component").then((m) => m.LoginPageComponent),
    canActivate: [ canOpenAuthGuard ]
  },
  {
    title: "Transaction create",
    path: "transactions/create",
    loadComponent: () => import("./transactions/pages/upsert-transaction-page/upsert-transaction-page.component")
      .then((m) => m.UpsertTransactionPageComponent),
    canActivate: [ canOpenAppGuard ],
    data: {
      mode: "CREATE"
    }
  },
  {
    title: "Transaction",
    path: "transactions/:id",
    loadComponent: () => import("./transactions/pages/transaction-page/transaction-page.component")
      .then((m) => m.TransactionPageComponent),
    canActivate: [ canOpenAppGuard ],
  },
  {
    title: "Transaction update",
    path: "transactions/:id/update",
    loadComponent: () => import("./transactions/pages/upsert-transaction-page/upsert-transaction-page.component")
      .then((m) => m.UpsertTransactionPageComponent),
    canActivate: [ canOpenAppGuard ],
    data: {
      mode: "UPDATE"
    }
  },
  {
    title: "Home",
    path: "",
    component: HomePageComponent,
    canActivate: [ canOpenAppGuard ]
  }
]
