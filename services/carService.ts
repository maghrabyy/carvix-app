import { apiClient } from "../API/axios-config";
import { API_ENDPOINTS } from "../API/endpoints";
import {
  GetCarModelsRequestDTO,
  GetMarketInsightsRequestDTO,
  GetVehiclePriceTrendRequestDTO,
  GetBudgetRecommendationRequestDTO,
  GetMostPopularBrandsRequestDTO,
  GetMostPopularModelsRequestDTO,
  GetCarComparisonRequestDTO,
} from "../types/requestDTOs.type";
import {
  GetCarBrandsResponseDTO,
  GetCarModelsResponseDTO,
  GetMarketInsightsResponseDTO,
  GetVehiclePriceTrendResponseDTO,
  GetBudgetRecommendationResponseDTO,
  GetMostPopularBrandsResponseDTO,
  GetMostPopularModelsResponseDTO,
  GetCarComparisonResponseDTO,
} from "../types/responseDTOs.type";

export const getCarBrands = async (): Promise<GetCarBrandsResponseDTO> => {
  const response = await apiClient.get<GetCarBrandsResponseDTO>(
    API_ENDPOINTS.CAR_BRANDS,
  );
  return response.data;
};

export const getCarModels = async (
  params: GetCarModelsRequestDTO,
): Promise<GetCarModelsResponseDTO> => {
  const response = await apiClient.get<GetCarModelsResponseDTO>(
    API_ENDPOINTS.CAR_MODELS,
    { params },
  );
  return response.data;
};

export const getMarketInsights = async (
  params?: GetMarketInsightsRequestDTO,
): Promise<GetMarketInsightsResponseDTO> => {
  const response = await apiClient.get<GetMarketInsightsResponseDTO>(
    API_ENDPOINTS.MARKET_INSIGHTS,
    { params },
  );
  return response.data;
};

export const getVehiclePriceTrend = async (
  params: GetVehiclePriceTrendRequestDTO,
): Promise<GetVehiclePriceTrendResponseDTO> => {
  const response = await apiClient.get<GetVehiclePriceTrendResponseDTO>(
    API_ENDPOINTS.VEHICLE_PRICE_TREND,
    { params },
  );
  return response.data;
};

export const getBudgetRecommendation = async (
  params: GetBudgetRecommendationRequestDTO,
): Promise<GetBudgetRecommendationResponseDTO> => {
  const response = await apiClient.get<GetBudgetRecommendationResponseDTO>(
    API_ENDPOINTS.BUDGET_RECOMMENDATION,
    { params },
  );
  return response.data;
};

export const getMostPopularBrands = async (
  params?: GetMostPopularBrandsRequestDTO,
): Promise<GetMostPopularBrandsResponseDTO> => {
  const response = await apiClient.get<GetMostPopularBrandsResponseDTO>(
    API_ENDPOINTS.MOST_POPULAR_BRANDS,
    { params },
  );
  return response.data;
};

export const getMostPopularModels = async (
  params: GetMostPopularModelsRequestDTO,
): Promise<GetMostPopularModelsResponseDTO> => {
  const response = await apiClient.get<GetMostPopularModelsResponseDTO>(
    API_ENDPOINTS.MOST_POPULAR_MODELS,
    { params },
  );
  return response.data;
};

export const getCarComparison = async (
  params: GetCarComparisonRequestDTO,
): Promise<GetCarComparisonResponseDTO> => {
  const response = await apiClient.get<GetCarComparisonResponseDTO>(
    API_ENDPOINTS.CAR_COMPARISON,
    { params },
  );
  return response.data;
};
