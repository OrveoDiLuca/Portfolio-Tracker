import { CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { InfoCard } from '../../shared/info-card/info-card';
import { Portfolio } from '../../core/services/portfolio';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, InfoCard, CurrencyPipe, PercentPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  protected readonly portfolio = inject(Portfolio);
  protected readonly today = new Date();

}
