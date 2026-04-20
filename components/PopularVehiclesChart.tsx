import React from "react";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Dimensions } from "react-native";
import { Colors } from "../colors";
import { MarketInsightVehicle } from "../types/responseDTOs.type";

interface PopularVehiclesChartProps {
  data: MarketInsightVehicle[];
}

export const PopularVehiclesChart = ({ data }: PopularVehiclesChartProps) => {
  const sortedData = [...data].sort((a, b) => b.count - a.count);
  const maxCount = sortedData.length > 0 ? sortedData[0].count : 1;
  const availableWidth = Dimensions.get("window").width - 32 - 140 - 35;

  return (
    <VStack style={{ gap: 12 }}>
      {sortedData.map((item, index) => {
        const opacity = 1 - (index * 0.65) / 7;
        const width = Math.max(8, (item.count / maxCount) * availableWidth);

        return (
          <HStack
            key={`${item.brand}-${item.model}-${index}`}
            style={{ alignItems: "center", gap: 8 }}
          >
            <Text
              style={{ width: 140, color: Colors.textSecondary, fontSize: 12 }}
              numberOfLines={1}
            >
              {item.brand} {item.model}
            </Text>

            <Box
              style={{
                backgroundColor: Colors.primary,
                height: 10,
                borderRadius: 5,
                width: width,
                opacity: opacity,
              }}
            />
          </HStack>
        );
      })}
    </VStack>
  );
};
