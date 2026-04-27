import React, { useEffect, useState } from "react";
import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Colors } from "@/colors";
import { usePricePrediction } from "../hooks/query/predictionQueries";
import { SafeAreaView } from "react-native-safe-area-context";
import { PricePredictionForm } from "@/components/PricePrediction/PricePredictionForm";
import { PricePredictionResult } from "@/components/PricePrediction/PricePredictionResult";
import { PredictCarPriceRequestDTO } from "@/types/requestDTOs.type";

export default function PredictScreen() {
  const [isPredicted, setIsPredicted] = useState(false);
  const scrollViewRef = React.useRef<ScrollView | null>(null);

  const {
    mutate: predictPrice,
    data: predictionData,
    isPending: predicting,
    isSuccess,
  } = usePricePrediction();

  const handlePredict = (dto: PredictCarPriceRequestDTO) => {
    setIsPredicted(true);
    predictPrice(dto);
  };

  useEffect(() => {
    if (isSuccess && scrollViewRef?.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [isSuccess, scrollViewRef]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.backgroundSecondary }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16 }}
          ref={scrollViewRef}
        >
          <PricePredictionForm predicting={predicting} onPredict={handlePredict} />

          {isPredicted && predictionData && (
            <PricePredictionResult predictedPrice={predictionData.predicted_price} />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
