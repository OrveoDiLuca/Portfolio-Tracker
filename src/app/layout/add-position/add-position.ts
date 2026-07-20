import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { CoinSearchResult, Coingecko } from '../../core/services/coingecko'
import { Portfolio } from '../../core/services/portfolio'
import { calculateCostBasis, calculateGainLoss } from '../../shared/utils/position-calculation';
import { AssetType } from '../../shared/models/position.model';
import { inferTypeOfAsset } from '../../shared/models/asset-type.util';


@Component({
  selector: 'app-add-position',
  imports: [FormsModule, RouterLink],
  templateUrl: './add-position.html',
  styleUrl: './add-position.css',
})
export class AddPosition {
  private readonly portfolio = inject(Portfolio)
  private readonly coingecko = inject(Coingecko)
  private readonly router = inject(Router)
  private debounceTime?: ReturnType<typeof setTimeout> //Evita que se llama a la api cada vez que el usuario presiona una tecla. 

  readonly searchTerm = signal('') //similar al useState de React. 
  readonly searchResults = signal<CoinSearchResult[]>([])
  readonly searching = signal(false)
  readonly searchError = signal<string | null>(null)

  readonly selectedAsset = signal<CoinSearchResult | null>(null)
  readonly quantity = signal<number | null>(null)
  readonly purchasePrice = signal<number | null>(null)
  readonly purchaseDate = signal(new Date().toISOString().slice(0, 10))

  readonly currentPrice = signal<number | null>(null)
  readonly priceError = signal<string | null>(null)

  readonly costBasis = computed(() => (
    calculateCostBasis(this.quantity() ?? 0, this.purchasePrice() ?? 0)
  ))

  readonly estimatedPnL = computed(() => {
    const price = this.currentPrice();
    if (price === null) return null
    return calculateGainLoss(this.quantity() ?? 0, this.purchasePrice() ?? 0, price)
  })

  readonly canSubmit = computed(
    () =>
      this.selectedAsset() !== null &&
      (this.quantity() ?? 0) > 0 &&
      (this.purchasePrice() ?? 0) > 0,
  );

  constructor() {
    effect(() => {
      const term = this.searchTerm().trim()
      clearTimeout(this.debounceTime)

      if (this.selectedAsset()?.name === term || term.length < 2) {
        this.searchResults.set([])
        return
      }

      this.debounceTime = setTimeout(() => this.runSearch(term), 400)
    });

    effect(() => {
      const asset = this.selectedAsset();
      if (!asset) {
        this.currentPrice.set(null)
        return
      }
      this.priceError.set(null)
      this.coingecko.getPrices([asset.id]).subscribe({
        next: (prices) => this.currentPrice.set(prices[asset.id]?.usd ?? null),
        error: () => this.priceError.set("Was impossible to obtain the price of the asset.")
      })
    })
  }

  private assetLabel(coin: CoinSearchResult): string {
    return `${coin.name} - (${coin.symbol.toUpperCase()})`
  }

  private runSearch(term: string) {
    this.searching.set(true)
    this.searchError.set(null)
    this.coingecko.searchCoins(term).subscribe({
      next: (coins) => {
        this.searchResults.set(coins.slice(0, 8))
        this.searching.set(false)
      },
      error: () => {
        this.searchError.set("No se pudo encontrar el activo. Prueba otra vez. ")
        this.searching.set(false)
      }
    })
  }

  selectAsset(coin: CoinSearchResult) {
    this.selectedAsset.set(coin);
    this.searchTerm.set(coin.name);
    this.searchResults.set([])
  }

  addPosition(): void {
    const asset = this.selectedAsset();
    if (!asset || !this.canSubmit()) return;

    this.portfolio.addPositions({
      id: crypto.randomUUID(),
      assetSymbol: asset.symbol.toUpperCase(),
      assetName: asset.name,
      assetType: inferTypeOfAsset(asset.symbol),
      coingeckoId: asset.id,
      quantity: this.quantity() ?? 0,
      purchasePrice: this.purchasePrice() ?? 0,
      purchaseDate: this.purchaseDate(),
    });

    this.router.navigate(['/positions']);
  }

  cancel(): void {
    this.router.navigate(['/positions']);
  }
}
