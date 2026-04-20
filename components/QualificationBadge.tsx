import React from 'react';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Colors } from '../colors';

interface QualificationBadgeProps {
  qualification: "within_range" | string;
  marketAvgPrice: number;
  sellingPrice: number;
}

export const QualificationBadge = ({
  qualification,
  marketAvgPrice,
  sellingPrice,
}: QualificationBadgeProps) => {
  let bgColor: string = Colors.successLight;
  let textColor: string = Colors.successDark;
  let label = "Within average";

  if (qualification.includes("above") || qualification.includes("high")) {
    bgColor = Colors.warningLight;
    textColor = Colors.warningDark;
    label = "Above average";
  } else if (qualification.includes("below") || qualification.includes("low")) {
    bgColor = Colors.dangerLight;
    textColor = Colors.danger;
    label = "Below average";
  }

  const percentageDiff = ((sellingPrice - marketAvgPrice) / marketAvgPrice) * 100;

  return (
    <VStack style={{ backgroundColor: bgColor, borderRadius: 12, padding: 12, gap: 8 }}>
      <Text style={{ color: textColor, fontWeight: "bold" }}>
        {label}
      </Text>
      <HStack style={{ justifyContent: "space-between" }}>
        <Text style={{ color: textColor, fontSize: 12 }}>
          Market avg: EGP {marketAvgPrice.toLocaleString()}
        </Text>
      </HStack>
      <HStack style={{ justifyContent: "space-between" }}>
        <Text style={{ color: textColor, fontSize: 12, fontWeight: "bold" }}>
          Your price: EGP {sellingPrice.toLocaleString()} ({percentageDiff > 0 ? '+' : ''}
          {percentageDiff.toFixed(1)}%)
        </Text>
      </HStack>
    </VStack>
  );
};
