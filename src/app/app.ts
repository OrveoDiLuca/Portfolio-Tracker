import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { inject } from '@angular/core';
import { Coingecko } from './core/services/coingecko';
import { Sidebar } from './layout/sidebar/sidebar';
import { Positions } from './layout/positions/positions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Positions],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Portfolio-Tracker');
  private readonly coingecko = inject(Coingecko); 
  
}
