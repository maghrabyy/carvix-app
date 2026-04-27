import React, { useState } from "react";
import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Colors } from "../colors";
import { useBudgetRecommendation } from "@/hooks/query/useCarQueries";
import { GetBudgetRecommendationRequestDTO } from "@/types/requestDTOs.type";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "@/types/router.type";
import { BudgetRecommendationForm } from "../components/BudgetRecommendationForm";
import { BudgetRecommendationResults } from "../components/BudgetRecommendationResults";

export default function BudgetRecommendationScreen() {
  const route =
    useRoute<RouteProp<RootStackParamList, "BudgetRecommendation">>();
  const [queryParams, setQueryParams] =
    useState<GetBudgetRecommendationRequestDTO | null>(null);

  const params = route.params;
  const budget = params?.budget ?? 0;

  const { data, isFetching, isError } = useBudgetRecommendation(
    queryParams ?? { budget: 0 },
    !!queryParams,
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.backgroundSecondary }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <VStack style={{ paddingTop: 8, paddingBottom: 20 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: Colors.textPrimary,
              }}
            >
              Budget Finder
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors.textSecondary,
                marginTop: 4,
              }}
            >
              Discover vehicles that match your budget
            </Text>
          </VStack>

          <BudgetRecommendationForm
            defaultBudget={budget}
            isFetching={isFetching}
            onSubmit={setQueryParams}
          />

          <BudgetRecommendationResults data={data} isError={isError} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
