import React from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Colors } from "../colors";
import { VehicleCard } from "./VehicleCard";
import { GetBudgetRecommendationResponseDTO } from "@/types/responseDTOs.type";

interface BudgetRecommendationResultsProps {
  data: GetBudgetRecommendationResponseDTO | undefined;
  isError: boolean;
}

export const BudgetRecommendationResults = ({
  data,
  isError,
}: BudgetRecommendationResultsProps) => {
  return (
    <>
      {/* Error State */}
      {isError && (
        <Card
          style={{
            padding: 16,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: Colors.dangerLight,
            backgroundColor: Colors.dangerLight,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              color: Colors.danger,
              fontSize: 14,
              textAlign: "center",
            }}
          >
            Something went wrong. Please try again.
          </Text>
        </Card>
      )}

      {/* Results */}
      {data && (
        <VStack style={{ gap: 12 }}>
          <HStack
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 4,
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: Colors.textPrimary,
              }}
            >
              {data.recommendations.length > 0
                ? `${data.recommendations.length} Matches Found`
                : "No Matches Found"}
            </Text>
            {data.brandFilter && (
              <Text style={{ fontSize: 12, color: Colors.textTertiary }}>
                Brand: {data.brandFilter}
              </Text>
            )}
          </HStack>

          {data.recommendations.length === 0 && (
            <Card
              style={{
                padding: 24,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: Colors.borderLight,
                backgroundColor: Colors.background,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.textSecondary,
                  textAlign: "center",
                }}
              >
                No vehicles found within your budget.{"\n"}Try increasing
                your budget or removing filters.
              </Text>
            </Card>
          )}
          <VStack>
            {data.recommendations.map((vehicle, index) => (
              <VehicleCard
                key={`${vehicle.brand}-${vehicle.model}-${vehicle.year}-${index}`}
                brand={vehicle.brand}
                model={vehicle.model}
                year={vehicle.year}
                price={vehicle.avgPrice}
              />
            ))}
          </VStack>
        </VStack>
      )}
    </>
  );
};
