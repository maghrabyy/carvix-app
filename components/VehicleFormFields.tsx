import React from "react";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
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
import { Input, InputField } from "@/components/ui/input";
import { ChevronDown } from "lucide-react-native";
import { Colors } from "../colors";
import { BrandSelect } from "@/components/CarSelection/BrandSelect";
import { ModelSelect } from "@/components/CarSelection/ModelSelect";
import { Controller, Control, UseFormSetValue, useWatch } from "react-hook-form";

export type VehicleFieldValues = {
  brand: string;
  model: string;
  year: string;
  km: string;
  transmission: string;
};

interface VehicleFormFieldsProps {
  control: Control<VehicleFieldValues>;
  setValue: UseFormSetValue<VehicleFieldValues>;
}

export const VehicleFormFields = ({
  control,
  setValue,
}: VehicleFormFieldsProps) => {
  const brand = useWatch({ control, name: "brand" });

  return (
    <>
      <Controller
        control={control}
        name="brand"
        render={({ field }) => (
          <BrandSelect
            value={field.value}
            onChange={(val) => {
              field.onChange(val);
              setValue("model", "");
            }}
          />
        )}
      />

      <Controller
        control={control}
        name="model"
        render={({ field }) => (
          <ModelSelect
            brand={brand}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <VStack style={{ gap: 8 }}>
        <Text
          style={{
            color: Colors.textSecondary,
            fontSize: 12,
            marginLeft: 4,
          }}
        >
          Year
        </Text>
        <Input
          size="md"
          variant="outline"
          style={{ backgroundColor: Colors.backgroundSecondary }}
        >
          <Controller
            control={control}
            name="year"
            render={({ field }) => (
              <InputField
                placeholder="e.g. 2024"
                value={field.value}
                onChangeText={field.onChange}
                keyboardType="numeric"
              />
            )}
          />
        </Input>
      </VStack>

      <VStack style={{ gap: 8 }}>
        <Text
          style={{
            color: Colors.textSecondary,
            fontSize: 12,
            marginLeft: 4,
          }}
        >
          Mileage (KM)
        </Text>
        <Input
          size="md"
          variant="outline"
          style={{ backgroundColor: Colors.backgroundSecondary }}
        >
          <Controller
            control={control}
            name="km"
            render={({ field }) => (
              <InputField
                placeholder="e.g. 50000"
                value={field.value}
                onChangeText={field.onChange}
                keyboardType="numeric"
              />
            )}
          />
        </Input>
      </VStack>

      <VStack style={{ gap: 8 }}>
        <Text
          style={{
            color: Colors.textSecondary,
            fontSize: 12,
            marginLeft: 4,
          }}
        >
          Transmission
        </Text>
        <Controller
          control={control}
          name="transmission"
          render={({ field }) => (
            <Select
              selectedValue={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger variant="outline" size="md">
                <SelectInput placeholder="Select Transmission" />
                <SelectIcon className="mr-3">
                  <ChevronDown size={16} />
                </SelectIcon>
              </SelectTrigger>
              <SelectPortal>
                <SelectContent>
                  <SelectScrollView>
                    {["Automatic", "Manual"].map((t) => (
                      <SelectItem key={t} label={t} value={t} />
                    ))}
                  </SelectScrollView>
                </SelectContent>
              </SelectPortal>
            </Select>
          )}
        />
      </VStack>
    </>
  );
};
