import { CommonModule } from "@angular/common"
import { ChangeDetectionStrategy, Component } from "@angular/core"
import { RouterLink } from "@angular/router"

@Component({
  selector: "bu-home-page",
  standalone: true,
  imports: [ CommonModule, RouterLink ],
  templateUrl: "./home-page.component.html",
  styleUrls: [ "./home-page.component.css" ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {

}
