import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Colors } from "@/colors";

export type SegmentedTabOption<T extends string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

export default function SegmentedTabs<T extends string>({
  value,
  options,
  onChange,
  containerStyle,
}: {
  value: T;
  options: SegmentedTabOption<T>[];
  onChange: (value: T) => void;
  containerStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <HStack
      style={[
        {
          backgroundColor: Colors.background,
          borderRadius: 16,
          padding: 4,
        },
        containerStyle,
      ]}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        const isDisabled = !!option.disabled;

        return (
          <Button
            key={option.value}
            style={{
              flex: 1,
              backgroundColor: isSelected ? Colors.primaryLight : "transparent",
              opacity: isDisabled ? 0.4 : 1,
            }}
            isDisabled={isDisabled}
            onPress={() => onChange(option.value)}
          >
            <ButtonText
              style={{
                color: isSelected ? "white" : Colors.textSecondary,
              }}
            >
              {option.label}
            </ButtonText>
          </Button>
        );
      })}
    </HStack>
  );
}

