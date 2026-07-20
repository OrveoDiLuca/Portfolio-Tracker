import { Component, input } from '@angular/core';

@Component({
  selector: 'app-info-card',
  imports: [],
  templateUrl: './info-card.html',
  styleUrl: './info-card.css',
})
export class InfoCard {
  readonly label = input.required<string>(); 
  readonly value = input.required<string>(); 
  readonly sublabel = input<string | null>(null);;
  readonly tone = input<'default' | 'positive' | 'negative'>('default')
}
