import { Component } from '@angular/core';
import { HeaderComponent } from "./components/header/header.component";
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./components/footer/footer.component";



@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl:'./app.component.css',
  imports: [HeaderComponent, RouterOutlet, FooterComponent],
})
export class AppComponent {
  title = 'flight-booking';
}
