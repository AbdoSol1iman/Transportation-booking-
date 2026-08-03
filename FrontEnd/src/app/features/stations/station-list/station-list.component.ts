import { Component } from '@angular/core';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-station-list',
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './station-list.component.html',
  styleUrl: './station-list.component.css',
})
export class StationListComponent {}


