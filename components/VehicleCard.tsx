import React from "react";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Trash2 } from "lucide-react-native";
import { Colors } from "../colors";

interface VehicleCardProps {
  brand: string;
  model: string;
  year: number | string;
  price?: number;
  km?: number;
  transmission?: string;
  showSavingsBadge?: boolean;
  onDelete?: () => void;
}

export const VehicleCard = ({
  brand,
  model,
  year,
  price,
  km,
  transmission,
  showSavingsBadge,
  onDelete,
}: VehicleCardProps) => {
  return (
    <Card
      style={{
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        backgroundColor: Colors.background,
      }}
    >
      <HStack style={{ justifyContent: "space-between", alignItems: "center" }}>
        <VStack style={{ gap: 4, flex: 1 }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
              color: Colors.textPrimary,
            }}
          >
            {brand} {model} {year}
          </Text>
          <HStack style={{ gap: 8, flexWrap: "wrap" }}>
            {price !== undefined && (
              <Text style={{ color: Colors.textSecondary, fontSize: 14 }}>
                EGP {price.toLocaleString()}
              </Text>
            )}
            {km !== undefined && (
              <Text style={{ color: Colors.textTertiary, fontSize: 12 }}>
                • {km.toLocaleString()} KM
              </Text>
            )}
            {transmission && (
              <Text style={{ color: Colors.textTertiary, fontSize: 12 }}>
                • {transmission}
              </Text>
            )}
          </HStack>

          {showSavingsBadge && (
            <VStack
              style={{
                backgroundColor: Colors.successLight,
                padding: 8,
                borderRadius: 8,
                marginTop: 8,
                alignSelf: "flex-start",
              }}
            >
              <Text
                style={{
                  color: Colors.successDark,
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                Great deal
              </Text>
            </VStack>
          )}
        </VStack>

        {onDelete && (
          <Trash2
            size={20}
            color={Colors.danger}
            onPress={onDelete}
            style={{ padding: 8 }}
          />
        )}
      </HStack>
    </Card>
  );
};
