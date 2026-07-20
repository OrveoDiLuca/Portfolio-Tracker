import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Portfolio } from '../../core/services/portfolio';
import { Coingecko } from '../../core/services/coingecko';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { calculateCostBasis, calculateCurrentValue, calculateGainLoss, calculatePnLPercentage } from '../../shared/utils/position-calculation';
import { DeletePosition } from '../delete-position/delete-position';
import { InfoCard } from '../../shared/info-card/info-card';

@Component({
  selector: 'app-position-detail',
  imports: [CurrencyPipe, PercentPipe, RouterLink, DeletePosition, InfoCard],
  templateUrl: './position-detail.html',
  styleUrl: './position-detail.css',
})
export class PositionDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly portfolio = inject(Portfolio);
  private readonly coingecko = inject(Coingecko)

  private readonly positionId = this.route.snapshot.paramMap.get('id');
  private readonly original = this.portfolio.position().find((p) => p.id === this.positionId);
  private readonly notFound = this.original === undefined;
  readonly currentPrice = signal<number | null>(null);
  readonly priceError = signal<string | null>(null)
  readonly assetName = this.original?.assetName ?? '';
  readonly assetSymbol = this.original?.assetSymbol ?? '';
  readonly Id = this.original?.id ?? '';
  readonly assetTypeLabel = this.original?.assetType === 'stock' ? 'Equity' : 'Crypto';
  readonly quantity = this.original?.quantity ?? 0;
  readonly avgCost = this.original?.purchasePrice ?? 0;
  readonly purchaseDate = this.original?.purchaseDate ?? '';

  readonly costBasis = computed(() => {
    if (!this.original) return null;
    return calculateCostBasis(this.original.quantity, this.original.purchasePrice);
  });

  readonly marketValue = computed(() => {
    const price = this.currentPrice();
    if (price === null || !this.original) return null;
    return calculateCurrentValue(this.original.quantity, price);
  });

  readonly pnlPercentage = computed(() => {
    const cost = this.costBasis();
    const gain = this.gainLoss();
    if (cost === null || gain === null) return null;
    return calculatePnLPercentage(cost, gain);
  });

  constructor() {
    const coingeckoId = this.original?.coingeckoId;
    if (!coingeckoId) return;

    this.coingecko.getPrices([coingeckoId]).subscribe({
      next: (prices) => this.currentPrice.set(prices[coingeckoId]?.usd ?? null),
      error: () => this.priceError.set('No se pudo obtener el precio actual.'),
    });
  }

  readonly gainLoss = computed(() => {
    const price = this.currentPrice();
    if (price === null || !this.original) return null;
    return calculateGainLoss(this.original.quantity, this.original.purchasePrice, price);
  });
}
