
export type AssetType = 'stock' | 'crypto'

export interface Position {
    id: string; 
    assetSymbol: string; 
    assetName: string;
    assetType: AssetType;
    coingeckoId: string | null; 
    quantity: number; 
    purchasePrice: number;
    purchaseDate: string
}
