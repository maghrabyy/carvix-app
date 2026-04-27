import React from "react";
import { ScrollView } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useMarketInsights } from "../hooks/query/useCarQueries";
import { Colors } from "../colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { BrandsAveragePriceChart } from "../components/BrandsAveragePriceChart";
import { MostPopularVehicleChart } from "../components/MostPopularVehicleChart";
import { MarketTrendsChart } from "../components/MarketTrendsChart";

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView>
        <VStack style={{ paddingHorizontal: 16, gap: 16 }}>
          <BrandsAveragePriceChart
            data={data?.averagePriceByBrand}
            isLoading={isLoading}
          />
          <MostPopularVehicleChart
            data={data?.mostPopularVehicles}
            isLoading={isLoading}
          />
          <MarketTrendsChart
            data={data?.marketTrends}
            isLoading={isLoading}
          />
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
