export type GetCarBrandsResponseDTO = string[];
export type GetCarModelsResponseDTO = string[];

export interface MarketInsightBrandPrice {
  avgPrice: number;
  brand: string;
  count: number;
}

export interface MarketInsightVehicle {
  avgPrice: number;
  brand: string;
  count: number;
  model: string;
}

export interface MarketTrendPoint {
  label: string;
  value: number;
}

export interface MarketTrends {
  monthly: MarketTrendPoint[];
  yearly: MarketTrendPoint[];
}

export interface GetMarketInsightsResponseDTO {
  averagePriceByBrand: MarketInsightBrandPrice[];
  marketTrends: MarketTrends;
  mostPopularVehicles: MarketInsightVehicle[];
}

export interface GetVehiclePriceTrendResponseDTO {
  brand: string;
  changePercent: number;
  currentAvgPrice: number;
  model: string;
  priceTrend: "up" | "low";
  year: number;
}

export interface BudgetRecommendationVehicle {
  avgPrice: number;
  brand: string;
  count: number;
  model: string;
  year: number;
}

export interface GetBudgetRecommendationResponseDTO {
  brandFilter: string | null;
  budget: number;
  maxVehicleAgeYears: number | null;
  recommendations: BudgetRecommendationVehicle[];
  sortBy: string | null;
  threshold: number | null;
}

export interface PopularBrand {
  avgPrice: number;
  brand: string;
  count: number;
}

export type GetMostPopularBrandsResponseDTO = PopularBrand[];

export interface PopularModel {
  avgPrice: number;
  brand: string;
  count: number;
  model: string;
}

export type GetMostPopularModelsResponseDTO = PopularModel[];

export interface CarComparisonInput {
  brand: string;
  km: number;
  kmFrom: number | null;
  kmTo: number | null;
  model: string;
  price: number;
  sameBrand: boolean;
  sameTransmission: boolean;
  sameYear: boolean;
  transmission: string;
  year: number;
  yearFrom: number | null;
  yearTo: number | null;
}

export interface PageInfo {
  hasNext: boolean;
  pageIndex: number;
  pageSIze: number;
  total: number;
}

export interface PriceRange {
  highestPrice: number;
  lowestPrice: number;
}

export interface ComparisonRecommendation {
  avgPrice: number;
  brand: string;
  km: number;
  model: string;
  transmission: "automatic" | "manual";
  year: number;
}

export interface GetCarComparisonResponseDTO {
  comparisonBasis: "brand_model_year_km" | "brand_model_year";
  input: CarComparisonInput;
  pageInfo: PageInfo;
  priceRange: PriceRange;
  sellingPriceQualification: string;
  vehicleRecommendations: ComparisonRecommendation[];
}

export interface PredictCarPriceResponseDTO {
  predicted_price: string;
}
