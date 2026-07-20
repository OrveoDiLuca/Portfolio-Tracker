import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../environments/environment'
import { Observable, map } from 'rxjs';


const NAME_TOKEN: Record<string, string> = {
  AAPL: 'Apple Inc.',
  MSFT: 'Microsoft Corp.',
  NVDA: 'NVIDIA Corp.',
  TSLA: 'Tesla, Inc.',
  AMZN: 'Amazon.com Inc.',
  GOOGL: 'Alphabet Inc.',
  META: 'Meta Platforms',
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  SOL: 'Solana',
}

export interface CoinSearchResult {
  id: string;
  symbol: string;
  name: string;
  market_cap_rank: number | null;
  thumb: string
}

@Injectable({
  providedIn: 'root',
})

export class Coingecko {
  private readonly http = inject(HttpClient);
  private readonly url = 'https://api.coingecko.com/api/v3';

  getPrices(
    coingeckoIds: string[],
  ): Observable<Record<string, { usd: number; usd_24h_change: number }>> {
    return this.http.get<Record<string, { usd: number; usd_24h_change: number }>>(
      `${this.url}/simple/price`,
      {
        params: {
          ids: coingeckoIds.join(','),
          vs_currencies: 'usd',
          include_24hr_change: 'true',
        },
        headers: { 'x-cg-demo-api-key': environment.coingeckoApiKey },
      },
    );
  }

  private rankBySymbolMatch(coins: CoinSearchResult[], query: string): CoinSearchResult[] {
    const normalizeQuery = query.trim().toLowerCase();

    return [...coins].sort((a, b) => {
      const aExact = a.symbol.toLowerCase() === normalizeQuery ? 0 : 1;
      const bExact = b.symbol.toLowerCase() === normalizeQuery ? 0 : 1;
      if (aExact !== bExact) return aExact - bExact;

      const aRank = a.market_cap_rank ?? Infinity;
      const bRank = b.market_cap_rank ?? Infinity;

      return aRank - bRank
    })
  }

  private applyFriendlyName(coin:CoinSearchResult) : CoinSearchResult{
    const nameCoin = NAME_TOKEN[coin.symbol.toUpperCase()]; 
    return nameCoin ? {...coin,name: nameCoin} : coin; 
  }

  searchCoins(query: string): Observable<CoinSearchResult[]> {
    return this.http.get<{ coins: CoinSearchResult[] }>(`${this.url}/search`, {
      params: { query },
      headers: { 'x-cg-demo-api-key': environment.coingeckoApiKey }
    }).pipe(
      map((res) => this.rankBySymbolMatch(res.coins, query)),
      map((coins) => coins.map((coin) => this.applyFriendlyName(coin)))
    )
  }
}
