import { Injectable, signal, effect, inject, computed } from '@angular/core';
import { Position } from '../../shared/models/position.model';
import { Coingecko } from './coingecko';
 import { calculateAllocationType, calculateCostBasis, calculateCurrentValue,
           calculateGainLoss, calculatePnLPercentage, calculateTotalCostBasis,
           calculateTotalValue } from '../../shared/utils/position-calculation';


//Este archivo es el que controla todo lo de la aplicacion, ingresa la lista de posiciones que tiene el usuario y sus calculos derivados. 
const STORAGE_KEY = 'portfolio-position';

@Injectable({
  providedIn: 'root',
})
export class Portfolio {
  private readonly coingecko = inject(Coingecko)
  private readonly _positions = signal<Position[]>(this.loadFromStorage())
  readonly position = this._positions.asReadonly();

  private readonly _prices = signal<Record<string, { usd: number,usd_24h_change : number }>>({})
  readonly prices = this._prices.asReadonly();
  readonly priceError = signal<string | null>(null)
  readonly totalValue = computed(() => calculateTotalValue(this._positions(), this._prices()))
  readonly totalCostBasis = computed(() => calculateTotalCostBasis(this._positions()))
  readonly allocation = computed(() =>
    calculateAllocationType(this._positions(), this._prices()),
  );


  readonly holdings = computed(() => {
    const prices = this._prices();
    return this._positions().map((pos) => {
      const currentPrice = pos.coingeckoId ? (prices[pos.coingeckoId]?.usd ?? null) : null;
      const costBasis = calculateCostBasis(pos.quantity, pos.purchasePrice);
      const gainLoss = currentPrice !== null
        ? calculateGainLoss(pos.quantity, pos.purchasePrice, currentPrice)
        : null;

      return {
        id: pos.id,
        assetSymbol: pos.assetSymbol,
        assetName: pos.assetName,
        quantity: pos.quantity,
        value: currentPrice !== null ? calculateCurrentValue(pos.quantity, currentPrice) : null,
        pnlPercent: gainLoss !== null ? calculatePnLPercentage(costBasis, gainLoss) : null,
      };
    });
  });


  readonly topMovers = computed(() => {
    const prices = this._prices(); 
    const seen = new Set<string>();

    return this._positions()
    .filter((p) => p.coingeckoId && !seen.has(p.coingeckoId) && seen.add(p.coingeckoId))
    .map((p) => ({
      symbol: p.assetSymbol, 
      name: p.assetName,
      change: prices[p.coingeckoId!]?.usd_24h_change ?? 0, 
    }))
  })

  addPositions(position: Position): void {
    this._positions.update((positions) => [...positions, position])
  }

  removePosition(id: string): void {
    this._positions.update((positions) => positions.filter((p) => p.id !== id))
  }

  updatePosition(id: string, changes: Partial<Position>): void {
    this._positions.update((positions) => (
      positions.map((p) => p.id === id ? { ...p, ...changes } : p)
    ))
  }

  private loadFromStorage(): Position[] {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  }

  readonly totalGainLoss = computed(() => this.totalValue() - this.totalCostBasis());

  readonly totalGainLossPercent = computed(() =>
    calculatePnLPercentage(this.totalCostBasis(), this.totalGainLoss()),
  );

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._positions()));
    });

    effect(() => {
      const ids = [
        ...new Set(
          this._positions()
            .map((p) => p.coingeckoId)
            .filter((id): id is string => id !== null),
        ),
      ];

      if (ids.length === 0) {
        this._prices.set({});
        return;
      }

      this.priceError.set(null);
      this.coingecko.getPrices(ids).subscribe({
        next: (prices) => this._prices.set(prices),
        error: () =>
          this.priceError.set('Failed to fetch prices from Coingecko API. Please try again later.'),
      });
    });
  }

}