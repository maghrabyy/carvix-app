import React from "react";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Colors } from "../colors";
import { SkeletonCard } from "./SkeletonCard";
import { PopularVehiclesChart } from "./PopularVehiclesChart";
import { MarketInsightVehicle } from "../types/responseDTOs.type";

interface MostPopularVehicleChartProps {
  data: MarketInsightVehicle[] | undefined;
  isLoading: boolean;
}

export const MostPopularVehicleChart = ({
  data,
  isLoading,
}: MostPopularVehicleChartProps) => {
  return (
    <VStack style={{ gap: 8, marginTop: 16 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: Colors.textPrimary,
        }}
      >
        Most Popular Vehicles
      </Text>
      {isLoading ? (
        <SkeletonCard rows={5} />
      ) : (
        <Card
          style={{
            padding: 16,
            borderWidth: 1,
            borderColor: Colors.borderLight,
            backgroundColor: Colors.backgroundSecondary,
          }}
        >
          {data?.length ? (
            <PopularVehiclesChart data={data} />
          ) : (
            <Text style={{ color: Colors.textSecondary }}>
              No data available
            </Text>
          )}
        </Card>
      )}
    </VStack>
  );
};
