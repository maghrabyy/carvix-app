import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { PredictCarPriceRequestDTO } from "../../types/requestDTOs.type";
import { PredictCarPriceResponseDTO } from "../../types/responseDTOs.type";
import * as predictionService from "../../services/predictionService";

export const usePricePrediction = (): UseMutationResult<
  PredictCarPriceResponseDTO,
  AxiosError,
  PredictCarPriceRequestDTO
> => {
  return useMutation<
    PredictCarPriceResponseDTO,
    AxiosError,
    PredictCarPriceRequestDTO
  >({
    mutationKey: ["price_prediction"],
    mutationFn: (dto) => predictionService.getPricePrediction(dto),
    retry: 3,
  });
};
