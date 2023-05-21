import { CommonModule } from "@angular/common"
import { Component } from "@angular/core"
import { MatButtonModule } from "@angular/material/button"
import { MatToolbarModule } from "@angular/material/toolbar"
import { RouterLink, RouterOutlet } from "@angular/router"

@Component({
  selector: "bu-root",
  standalone: true,
  imports: [ CommonModule, RouterOutlet, MatToolbarModule, RouterLink, MatButtonModule ],
  templateUrl: "./app.component.html",
  styleUrls: [ "./app.component.css" ]
})
export class AppComponent {
  title = "budget"
}
