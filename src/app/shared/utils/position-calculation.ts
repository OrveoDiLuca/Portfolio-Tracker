import { AssetType, Position } from "../models/position.model";

export function calculateCostBasis(quantity: number, purchasePrice: number): number{
    return quantity * purchasePrice;
}

export function calculateCurrentValue(quantity: number, currentPrice: number) : number{
    return quantity * currentPrice; 
}

export function calculateGainLoss(quantity: number, purchasePrice: number, currentPrice: number): number{
    return calculateCurrentValue(quantity, currentPrice) - calculateCostBasis(quantity, purchasePrice);
}

export function calculatePnLPercentage(costBasis: number, gainLoss: number): number{
    return costBasis === 0 ? 0 : (gainLoss / costBasis);
}

export function calculateTotalCostBasis(position: Position[]) : number {
    return position.reduce((total, p) => total + calculateCostBasis(p.quantity, p.purchasePrice), 0)
}

export function calculateTotalValue(position: Position[], prices: Record<string, {usd: number}>): number {
    return position.reduce((total,p) => {
        const price = p.coingeckoId ? prices[p.coingeckoId]?.usd : undefined;
        return price !== undefined ? total + calculateCurrentValue(p.quantity, price) : total;
    },0)
}

export function calculateAllocationType(position: Position[], prices: Record<string, {usd:number}>): {type:AssetType; value: number; percent: number}[]{
    const total = calculateTotalValue(position, prices); 
    const types : AssetType[] = ['stock', 'crypto'];

    return types.map((type) => {
        const value = calculateTotalValue(
            position.filter((p) => p.assetType === type), 
            prices,
        );
        return {type, value, percent: total === 0 ? 0 : value / total}
    })
}