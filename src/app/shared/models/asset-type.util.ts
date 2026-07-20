import { AssetType } from "./position.model";

const KNOWN_STOCK_SYMBOLS = new Set(['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN', 'GOOGL', 'META'])

export function inferTypeOfAsset(symbol: string): AssetType{
    return KNOWN_STOCK_SYMBOLS.has(symbol.toUpperCase()) ? 'stock' : 'crypto';
}