import { Component, computed, effect, inject, signal } from '@angular/core';
import { Portfolio } from '../../core/services/portfolio'
import { Coingecko } from '../../core/services/coingecko';
import { RouterLink } from '@angular/router';
import { calculateCostBasis, calculateCurrentValue, calculateGainLoss, calculatePnLPercentage } from '../../shared/utils/position-calculation'
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { DeletePosition } from '../delete-position/delete-position';

@Component({
  selector: 'app-positions',
  imports: [RouterLink, CurrencyPipe, PercentPipe, DeletePosition],
  templateUrl: './positions.html',
  styleUrl: './positions.css',
})
export class Positions {
  portfolio = inject(Portfolio)

  readonly rows = computed(() => {
    return this.portfolio.position().map((pos) => {
      const priceEntry = pos.coingeckoId ? this.portfolio.prices()[pos.coingeckoId] : undefined;
      const currentPrice = priceEntry?.usd ?? null;
      const costBasis = calculateCostBasis(pos.quantity, pos.purchasePrice);
      const gainLoss = currentPrice !== null
        ? calculateGainLoss(pos.quantity, pos.purchasePrice, currentPrice)
        : null;

      return {
        id: pos.id,
        assetSymbol: pos.assetSymbol,
        assetName: pos.assetName,
        quantity: pos.quantity,
        avgCost: pos.purchasePrice,
        currentPrice,
        value: currentPrice !== null ? calculateCurrentValue(pos.quantity, currentPrice) : null,
        pnl: gainLoss,
        pnlPercent: gainLoss !== null ? calculatePnLPercentage(costBasis, gainLoss) : null,
      };
    });
  })

}
