import React, { useMemo } from "react";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Colors } from "@/colors";

type PricePredictionResultProps = {
  predictedPrice: string | number;
  currencyLabel?: string;
};

export function PricePredictionResult({
  predictedPrice,
  currencyLabel = "EGP",
}: PricePredictionResultProps) {
  const formatted = useMemo(() => {
    const asNumber = typeof predictedPrice === "number" ? predictedPrice : Number(predictedPrice);
    if (!Number.isFinite(asNumber)) return String(predictedPrice);
    return asNumber.toLocaleString();
  }, [predictedPrice]);

  return (
    <VStack style={{ marginTop: 24, gap: 16 }}>
      <Card
        style={{
          borderLeftWidth: 3,
          borderLeftColor: Colors.primary,
          padding: 16,
          backgroundColor: Colors.background,
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderBottomWidth: 1,
          borderColor: Colors.borderLight,
        }}
      >
        <Text style={{ fontSize: 14, color: Colors.textSecondary }}>
          Estimated Value
        </Text>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: Colors.primaryDark,
            marginTop: 8,
          }}
        >
          {currencyLabel} {formatted}
        </Text>
      </Card>
    </VStack>
  );
}

