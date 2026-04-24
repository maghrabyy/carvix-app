import { mlClient } from "../API/axios-config";
import { ML_ENDPOINTS } from "../API/endpoints";
import { PredictCarPriceRequestDTO } from "../types/requestDTOs.type";
import { PredictCarPriceResponseDTO } from "../types/responseDTOs.type";

export const getPricePrediction = async (
  dto: PredictCarPriceRequestDTO,
): Promise<PredictCarPriceResponseDTO> => {
  try {
    const response = await mlClient.post<PredictCarPriceResponseDTO>(
      ML_ENDPOINTS.PRICE_PREDICTION,
      dto,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching price prediction:", error);
    throw error;
  }
};
