import React from "react";
import { Dimensions } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { LineChart } from "react-native-chart-kit";
import { Colors } from "../colors";
import { SkeletonCard } from "./SkeletonCard";
import { MarketTrends } from "../types/responseDTOs.type";
import SegmentedTabs from "@/components/SegmentedTabs";

interface MarketTrendsChartProps {
  data: MarketTrends | undefined;
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
  decimalPlaces: 2,
  labelColor: () => Colors.textSecondary,
  propsForDots: {
    r: "4",
    strokeWidth: "2",
    stroke: Colors.primary,
  },
};

export const MarketTrendsChart = ({
  data,
  isLoading,
}: MarketTrendsChartProps) => {
  const [view, setView] = React.useState<"monthly" | "yearly">("monthly");

  const trendData =
    view === "monthly" ? data?.monthly ?? [] : data?.yearly ?? [];
  const labels = trendData.map((d) => d.label);
  const values = trendData.map((d) => d.value);
  const screenWidth = Dimensions.get("window").width;

  return (
    <VStack style={{ gap: 8, marginTop: 16 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: Colors.textPrimary,
        }}
      >
        Market Trends
      </Text>

      <SegmentedTabs
        value={view}
        onChange={setView}
        options={[
          { value: "monthly", label: "Monthly" },
          { value: "yearly", label: "Annual" },
        ]}
      />

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
              yAxisSuffix={"%"}
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
