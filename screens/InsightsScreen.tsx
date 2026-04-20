import React from "react";
import { ScrollView, Dimensions } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { LineChart } from "react-native-chart-kit";
import { useMarketInsights } from "../hooks/query/useCarQueries";
import { Colors } from "../colors";
import { SkeletonCard } from "../components/SkeletonCard";
import { PopularVehiclesChart } from "../components/PopularVehiclesChart";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InsightsScreen() {
  const { data, isError, refetch, isLoading } = useMarketInsights({
    brands_limit: 7,
    vehicle_limit: 8,
    sortBrands: "popular",
  });

  if (isError) {
    return (
      <VStack
        style={{ flex: 1, paddingHorizontal: 16, justifyContent: "center" }}
      >
        <Card
          style={{
            padding: 16,
            backgroundColor: Colors.dangerLight,
            borderWidth: 0,
          }}
        >
          <VStack style={{ gap: 12, alignItems: "center" }}>
            <Text
              style={{
                color: Colors.danger,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Failed to load market insights
            </Text>
            <Button
              style={{ backgroundColor: Colors.danger }}
              onPress={() => refetch()}
            >
              <ButtonText style={{ color: "white" }}>Retry</ButtonText>
            </Button>
          </VStack>
        </Card>
      </VStack>
    );
  }

  const chartData = data?.averagePriceByBrand || [];
  const displayChartData = chartData;

  const labels = displayChartData.map((d) =>
    d.brand.length > 6 ? d.brand.substring(0, 5) + "." : d.brand,
  );
  const values = displayChartData.map((d) => d.avgPrice);
  const screenWidth = Dimensions.get("window").width;

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView>
        <VStack style={{ paddingHorizontal: 16, gap: 16 }}>
          {/* Section 1: Average Price by Brand */}
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

          {/* Section 2: Most Popular Vehicles */}
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
                {data?.mostPopularVehicles?.length ? (
                  <PopularVehiclesChart data={data.mostPopularVehicles} />
                ) : (
                  <Text style={{ color: Colors.textSecondary }}>
                    No data available
                  </Text>
                )}
              </Card>
            )}
          </VStack>
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
