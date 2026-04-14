export interface GetCarModelsRequestDTO {
  brand: string;
}

export interface GetMarketInsightsRequestDTO {
  brands_limit?: number;
  vehicle_limit?: number;
}

export interface GetBudgetRecommendationRequestDTO {
  brand?: string;
  budget: number;
  sort_by?:     "avg_price_desc" |
    "avg_price_asc" |
    "model_year_desc" |
    "model_year_asc" |
    "most_popular" |
    "least_popular"
  limit?: number;
  budget_threshold?: number;
  max_age_years?: number;
}

export interface GetMostPopularBrandsRequestDTO {
  limit?: number;
}

export interface GetMostPopularModelsRequestDTO {
  brand: string;
  limit?: number;
}

export interface GetCarComparisonRequestDTO {
  brand: string;
  model: string;
  year: number;
  transmission: "automatic" | "manual"
  km: number;
  price: number;
  pageSize?: number;
  pageIndex?: number;
  sameBrand?: boolean;
  sameTransmission?: boolean;
  yearFrom?: string | number;
  yearTo?: string | number;
  sameYear?: boolean;
  kmFrom?: string | number;
  kmTo?: string | number;
}

export interface PredictCarPriceRequestDTO {
  brand: string;
  model: string;
  year: string;
  km: number;
  transmission: string;
  fuel: string;
}