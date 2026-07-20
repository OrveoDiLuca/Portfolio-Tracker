import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Portfolio } from '../../core/services/portfolio';
import { calculateCostBasis, calculateGainLoss } from '../../shared/utils/position-calculation';

@Component({
  selector: 'app-edit-position',
  imports: [FormsModule, RouterLink],
  templateUrl: './edit-position.html',
  styleUrl: './edit-position.css',
})
export class EditPosition {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router)
  private readonly portfolio = inject(Portfolio);
  

  private readonly positionId = this.route.snapshot.paramMap.get('id');
  private readonly original = this.portfolio.position().find((p) => p.id === this.positionId);
  readonly notFound = this.original === undefined;
  readonly assetLabel = this.original ? `${this.original.assetSymbol} (${this.original.assetSymbol})` : ''
  readonly quantity = signal(this.original?.quantity ?? 0);
  readonly purchasePrice = signal(this.original?.purchasePrice ?? 0);
  readonly purchaseDate = signal(this.original?.purchaseDate ?? new Date().toISOString().slice(0,10));

  readonly costBasis = computed(() => calculateCostBasis(this.quantity(), this.purchasePrice()))
  readonly canSubmitted = computed(() => this.quantity() > 0 && this.purchasePrice() > 0)

  save(): void{
    if(!this.positionId || !this.canSubmitted()) return; 

    this.portfolio.updatePosition(this.positionId, {
      quantity: this.quantity(),
      purchasePrice: this.purchasePrice(),
      purchaseDate: this.purchaseDate()
    });

    this.router.navigate(['/positions'])
  }

  cancel(): void{
    this.router.navigate(['/positions']);
  }
}
