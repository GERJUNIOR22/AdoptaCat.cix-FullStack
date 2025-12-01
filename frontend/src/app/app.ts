import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './layout/header/navigation.component';
import { FooterComponent } from './layout/footer/footer.component';
import { WhatsappButtonComponent } from './shared/components/ui/whatsapp-button.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationComponent, FooterComponent, WhatsappButtonComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'AdoptaCat';
}
