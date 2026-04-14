import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PredictCarPriceRequestDTO } from '../../types/requestDTOs.type';
import { PredictCarPriceResponseDTO } from '../../types/responseDTOs.type';
import * as predictionService from '../../services/predictionService';

export const usePricePrediction = (
  params: PredictCarPriceRequestDTO,
  enabled: boolean = true
): UseQueryResult<PredictCarPriceResponseDTO, AxiosError> => {
  return useQuery<PredictCarPriceResponseDTO, AxiosError>({
    queryKey: ['price_prediction', params],
    queryFn: () => predictionService.getPricePrediction(params),
    enabled: enabled && !!params.brand && !!params.model && !!params.year,
  });
};
