import { keepPreviousData, useQuery, UseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  GetCarModelsRequestDTO,
  GetMarketInsightsRequestDTO,
  GetBudgetRecommendationRequestDTO,
  GetMostPopularBrandsRequestDTO,
  GetMostPopularModelsRequestDTO,
  GetCarComparisonRequestDTO,
} from "../../types/requestDTOs.type";
import {
  GetCarBrandsResponseDTO,
  GetCarModelsResponseDTO,
  GetMarketInsightsResponseDTO,
  GetBudgetRecommendationResponseDTO,
  GetMostPopularBrandsResponseDTO,
  GetMostPopularModelsResponseDTO,
  GetCarComparisonResponseDTO,
} from "../../types/responseDTOs.type";
import * as carService from "../../services/carService";

export const useCarBrands = (): UseQueryResult<
  GetCarBrandsResponseDTO,
  AxiosError
> => {
  return useQuery<GetCarBrandsResponseDTO, AxiosError>({
    queryKey: ["car_brands"],
    queryFn: carService.getCarBrands,
  });
};

export const useCarModels = (
  params: GetCarModelsRequestDTO,
  enabled: boolean = true,
): UseQueryResult<GetCarModelsResponseDTO, AxiosError> => {
  return useQuery<GetCarModelsResponseDTO, AxiosError>({
    queryKey: ["car_models", params],
    queryFn: () => carService.getCarModels(params),
    enabled: enabled && !!params.brand,
  });
};

export const useMarketInsights = (
  params?: GetMarketInsightsRequestDTO,
): UseQueryResult<GetMarketInsightsResponseDTO, AxiosError> => {
  return useQuery<GetMarketInsightsResponseDTO, AxiosError>({
    queryKey: ["market_insights", params],
    queryFn: () => carService.getMarketInsights(params),
  });
};

export const useBudgetRecommendation = (
  params: GetBudgetRecommendationRequestDTO,
): UseQueryResult<GetBudgetRecommendationResponseDTO, AxiosError> => {
  return useQuery<GetBudgetRecommendationResponseDTO, AxiosError>({
    queryKey: ["budget_recommendation", params],
    queryFn: () => carService.getBudgetRecommendation(params),
    enabled: !!params.budget,
  });
};

export const useMostPopularBrands = (
  params?: GetMostPopularBrandsRequestDTO,
): UseQueryResult<GetMostPopularBrandsResponseDTO, AxiosError> => {
  return useQuery<GetMostPopularBrandsResponseDTO, AxiosError>({
    queryKey: ["most_popular_brands", params],
    queryFn: () => carService.getMostPopularBrands(params),
  });
};

export const useMostPopularModels = (
  params: GetMostPopularModelsRequestDTO,
  enabled: boolean = true,
): UseQueryResult<GetMostPopularModelsResponseDTO, AxiosError> => {
  return useQuery<GetMostPopularModelsResponseDTO, AxiosError>({
    queryKey: ["most_popular_models", params],
    queryFn: () => carService.getMostPopularModels(params),
    enabled: enabled && !!params.brand,
  });
};

export const useCarComparison = (
  params: GetCarComparisonRequestDTO,
  enabled: boolean = true,
): UseQueryResult<GetCarComparisonResponseDTO, AxiosError> => {
  return useQuery<GetCarComparisonResponseDTO, AxiosError>({
    queryKey: ["car_comparison", params],
    queryFn: () => carService.getCarComparison(params),
    placeholderData: keepPreviousData,
    enabled:
      enabled &&
      !!params.brand &&
      !!params.model &&
      !!params.year &&
      !!params.transmission &&
      !!params.price &&
      !!params.km,
  });
};
