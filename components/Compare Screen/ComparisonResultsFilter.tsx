import { Colors } from "@/colors";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Check } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";

type ComparisonResultsFilterProps = {
  sameBrand: boolean;
  setSameBrand: (val: boolean) => void;
  sameTransmission: boolean;
  setSameTransmission: (val: boolean) => void;
  sameYear: boolean;
  setSameYear: (val: boolean) => void;
  yearFrom: string;
  setYearFrom: (val: string) => void;
  yearTo: string;
  setYearTo: (val: string) => void;
  kmFrom: string;
  setKmFrom: (val: string) => void;
  kmTo: string;
  setKmTo: (val: string) => void;
  yearRangeError?: string;
  kmRangeError?: string;
};

function CheckboxRow({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable onPress={onToggle}>
      <HStack style={{ alignItems: "center", gap: 10, paddingVertical: 8 }}>
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: value ? Colors.primary : Colors.borderLight,
            backgroundColor: value ? Colors.primary : "transparent",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {value && <Check size={14} color="white" />}
        </View>
        <Text style={{ color: Colors.textPrimary }}>{label}</Text>
      </HStack>
    </Pressable>
  );
}

export function ComparisonResultsFilter({
  sameBrand,
  setSameBrand,
  sameTransmission,
  setSameTransmission,
  sameYear,
  setSameYear,
  yearFrom,
  setYearFrom,
  yearTo,
  setYearTo,
  kmFrom,
  setKmFrom,
  kmTo,
  setKmTo,
  yearRangeError,
  kmRangeError,
}: ComparisonResultsFilterProps) {
  const disableYearRange = sameYear;

  return (
    <VStack
      style={{
        gap: 10,
        backgroundColor: Colors.background,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.borderLight,
      }}
    >
      <Text style={{ fontWeight: "700", color: Colors.textPrimary }}>
        Filter alternatives
      </Text>

      <CheckboxRow
        label="Same Brand?"
        value={sameBrand}
        onToggle={() => setSameBrand(!sameBrand)}
      />
      <CheckboxRow
        label="Same Transmission?"
        value={sameTransmission}
        onToggle={() => setSameTransmission(!sameTransmission)}
      />
      <CheckboxRow
        label="Same Year?"
        value={sameYear}
        onToggle={() => setSameYear(!sameYear)}
      />

      <VStack style={{ gap: 8, opacity: disableYearRange ? 0.5 : 1 }}>
        <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>
          Year range
        </Text>
        <HStack style={{ gap: 12 }}>
          <Input
            size="md"
            variant="outline"
            style={{ flex: 1, backgroundColor: Colors.backgroundSecondary }}
            isDisabled={disableYearRange}
          >
            <InputField
              keyboardType="numeric"
              value={yearFrom}
              onChangeText={setYearFrom}
              placeholder="Year from"
              editable={!disableYearRange}
            />
          </Input>
          <Input
            size="md"
            variant="outline"
            style={{ flex: 1, backgroundColor: Colors.backgroundSecondary }}
            isDisabled={disableYearRange}
          >
            <InputField
              keyboardType="numeric"
              value={yearTo}
              onChangeText={setYearTo}
              placeholder="Year to"
              editable={!disableYearRange}
            />
          </Input>
        </HStack>
        {!!yearRangeError && (
          <Text style={{ color: Colors.danger, fontSize: 12 }}>
            {yearRangeError}
          </Text>
        )}
      </VStack>

      <VStack style={{ gap: 8 }}>
        <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>
          KM range
        </Text>
        <HStack style={{ gap: 12 }}>
          <Input
            size="md"
            variant="outline"
            style={{ flex: 1, backgroundColor: Colors.backgroundSecondary }}
          >
            <InputField
              keyboardType="numeric"
              value={kmFrom}
              onChangeText={setKmFrom}
              placeholder="KM from"
            />
          </Input>
          <Input
            size="md"
            variant="outline"
            style={{ flex: 1, backgroundColor: Colors.backgroundSecondary }}
          >
            <InputField
              keyboardType="numeric"
              value={kmTo}
              onChangeText={setKmTo}
              placeholder="KM to"
            />
          </Input>
        </HStack>
        {!!kmRangeError && (
          <Text style={{ color: Colors.danger, fontSize: 12 }}>
            {kmRangeError}
          </Text>
        )}
      </VStack>
    </VStack>
  );
}
