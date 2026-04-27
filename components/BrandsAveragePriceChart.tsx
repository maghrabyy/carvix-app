import React from "react";
import { Dimensions } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { LineChart } from "react-native-chart-kit";
import { Colors } from "../colors";
import { SkeletonCard } from "./SkeletonCard";
import { MarketInsightBrandPrice } from "../types/responseDTOs.type";

interface BrandsAveragePriceChartProps {
  data: MarketInsightBrandPrice[] | undefined;
  isLoading: boolean;
}

const chartConfig = {
  backgroundColor: "transparent",
  color: () => Colors.primaryLight,
  fillShadowGradient: Colors.primary,
  fillShadowGradientOpacity: 0.15,
  backgroundGradientFromOpacity: 0,
  backgroundGradientToOpacity: 0,
  strokeWidth: 2,
  decimalPlaces: 0,
  labelColor: () => Colors.textSecondary,
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: Colors.primary,
  },
};

export const BrandsAveragePriceChart = ({
  data,
  isLoading,
}: BrandsAveragePriceChartProps) => {
  const chartData = data || [];
  const labels = chartData.map((d) =>
    d.brand.length > 6 ? d.brand.substring(0, 5) + "." : d.brand,
  );
  const values = chartData.map((d) => d.avgPrice);
  const screenWidth = Dimensions.get("window").width;

  return (
    <VStack style={{ gap: 8 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: Colors.textPrimary,
        }}
      >
        Average Price by Brand
      </Text>
      {isLoading ? (
        <SkeletonCard height={200} />
      ) : (
        <Card
          style={{
            padding: 16,
            borderWidth: 1,
            borderColor: Colors.borderLight,
            backgroundColor: Colors.backgroundSecondary,
            alignItems: "center",
          }}
        >
          {values.length > 0 ? (
            <LineChart
              data={{
                labels,
                datasets: [{ data: values }],
              }}
              width={screenWidth - 32}
              height={200}
              yAxisSuffix={"k"}
              formatYLabel={(value) =>
                `${(Number(value) / 1000).toFixed(0)}`
              }
              chartConfig={chartConfig}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
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
