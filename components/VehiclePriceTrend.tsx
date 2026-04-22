import React from "react";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { TrendingDown, TrendingUp } from "lucide-react-native";
import { Colors } from "@/colors";
import { useVehiclePriceTrend } from "@/hooks/query/useCarQueries";

export function VehiclePriceTrend({
  brand,
  model,
  year,
}: {
  brand: string;
  model: string;
  year: number;
}) {
  const { data, isLoading, isError } = useVehiclePriceTrend(
    { brand, model, year },
    true,
  );

  if (isLoading) {
    return (
      <Text style={{ color: Colors.textTertiary, fontSize: 12, marginTop: 6 }}>
        Loading trend...
      </Text>
    );
  }

  if (isError || !data) return null;

  const isUp = data.priceTrend === "up" || data.changePercent >= 0;
  const TrendIcon = isUp ? TrendingUp : TrendingDown;
  const color = isUp ? Colors.successDark : Colors.danger;
  const bg = isUp ? Colors.successLight : Colors.dangerLight;

  const value = data.changePercent;
  const formatted = `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

  return (
    <HStack
      style={{
        marginTop: 8,
        alignSelf: "flex-start",
        alignItems: "center",
        gap: 6,
        backgroundColor: bg,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
      }}
    >
      <TrendIcon size={14} color={color} />
      <Text style={{ color, fontSize: 12, fontWeight: "bold" }}>
        {formatted}
      </Text>
    </HStack>
  );
}

