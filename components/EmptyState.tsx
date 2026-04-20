import React from "react";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { LucideIcon } from "lucide-react-native";
import { Colors } from "../colors";

interface EmptyStateProps {
  text: string;
  Icon?: LucideIcon;
}

export const EmptyState = ({ text, Icon }: EmptyStateProps) => {
  return (
    <VStack
      style={{
        borderWidth: 1,
        borderColor: Colors.borderDark,
        borderStyle: "dashed",
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      {Icon && <Icon size={32} color={Colors.textTertiary} />}
      <Text style={{ color: Colors.textSecondary, textAlign: 'center' }}>
        {text}
      </Text>
    </VStack>
  );
};
