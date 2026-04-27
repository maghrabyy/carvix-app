import React from "react";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectContent,
  SelectItem,
  SelectScrollView,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react-native";
import { Colors } from "../../colors";
import SegmentedTabs from "@/components/SegmentedTabs";
import {
  VehicleFormFields,
  VehicleFieldValues,
} from "@/components/VehicleFormFields";
import { Control, UseFormSetValue } from "react-hook-form";

interface StoredVehicle {
  id: string;
  brand: string;
  model: string;
  year: string;
  km: number;
  transmission: string;
}

interface ComparisonOptionsProps {
  mode: "garage" | "manual";
  onModeChange: (mode: "garage" | "manual") => void;
  vehicles: StoredVehicle[];
  selectedVehicleId: string;
  onSelectedVehicleChange: (id: string) => void;
  selectedVehicleLabel: string;
  control: Control<VehicleFieldValues>;
  setValue: UseFormSetValue<VehicleFieldValues>;
  onNavigateToGarage: () => void;
}

export const ComparisonOptions = ({
  mode,
  onModeChange,
  vehicles,
  selectedVehicleId,
  onSelectedVehicleChange,
  selectedVehicleLabel,
  control,
  setValue,
  onNavigateToGarage,
}: ComparisonOptionsProps) => {
  return (
    <>
      {vehicles.length === 0 && (
        <Card
          style={{
            backgroundColor: Colors.primaryXLight,
            borderColor: Colors.primaryLight,
            borderWidth: 1,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <Text style={{ color: Colors.primaryDark, marginBottom: 8 }}>
            No vehicles saved yet. Add your first vehicle to use quick
            selection.
          </Text>
          <Button
            size="sm"
            style={{ backgroundColor: Colors.primary }}
            onPress={onNavigateToGarage}
          >
            <ButtonText style={{ color: "white" }}>Go to Garage</ButtonText>
          </Button>
        </Card>
      )}

      <SegmentedTabs
        value={mode}
        onChange={onModeChange}
        containerStyle={{ marginBottom: 16 }}
        options={[
          {
            value: "garage",
            label: "From Garage",
            disabled: vehicles.length === 0,
          },
          { value: "manual", label: "Enter Manually" },
        ]}
      />

      <VStack
        style={{
          gap: 16,
          backgroundColor: Colors.background,
          padding: 16,
          borderRadius: 16,
        }}
      >
        {mode === "garage" ? (
          <VStack style={{ gap: 8 }}>
            <Text
              style={{
                color: Colors.textSecondary,
                fontSize: 12,
                marginLeft: 4,
              }}
            >
              Select Vehicle
            </Text>
            <Select
              selectedLabel={selectedVehicleLabel}
              selectedValue={selectedVehicleId}
              onValueChange={onSelectedVehicleChange}
            >
              <SelectTrigger variant="outline" size="md">
                <SelectInput placeholder="e.g. Nissan Sunny (2024)" />
                <SelectIcon className="mr-3">
                  <ChevronDown size={16} />
                </SelectIcon>
              </SelectTrigger>
              <SelectPortal>
                <SelectContent>
                  <SelectScrollView>
                    {vehicles.map((v) => (
                      <SelectItem
                        key={v.id}
                        label={`${v.brand} ${v.model} (${v.year})`}
                        value={v.id}
                      />
                    ))}
                  </SelectScrollView>
                </SelectContent>
              </SelectPortal>
            </Select>
          </VStack>
        ) : (
          <VehicleFormFields control={control} setValue={setValue} />
        )}
      </VStack>
    </>
  );
};
