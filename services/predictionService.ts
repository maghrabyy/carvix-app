import { mlClient } from '../API/axios-config';
import { ML_ENDPOINTS } from '../API/endpoints';
import { PredictCarPriceRequestDTO } from '../types/requestDTOs.type';
import { PredictCarPriceResponseDTO } from '../types/responseDTOs.type';

export const getPricePrediction = async (params: PredictCarPriceRequestDTO): Promise<PredictCarPriceResponseDTO> => {
  const response = await mlClient.get<PredictCarPriceResponseDTO>(ML_ENDPOINTS.PRICE_PREDICTION, { params });
  return response.data;
};
