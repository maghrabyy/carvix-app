import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Colors } from "../colors";
import { useForm, useWatch } from "react-hook-form";
import {
  VehicleFormFields,
  VehicleFieldValues,
} from "./VehicleFormFields";

interface AddVehicleFormProps {
  onSubmit: (values: {
    brand: string;
    model: string;
    year: string;
    km: number;
    transmission: string;
  }) => Promise<void>;
}

export const AddVehicleForm = ({ onSubmit }: AddVehicleFormProps) => {
  const { control, setValue, handleSubmit, reset } =
    useForm<VehicleFieldValues>({
      mode: "onChange",
      defaultValues: {
        brand: "",
        model: "",
        year: "",
        km: "",
        transmission: "",
      },
    });

  const brand = useWatch({ control, name: "brand" });
  const model = useWatch({ control, name: "model" });
  const year = useWatch({ control, name: "year" });
  const km = useWatch({ control, name: "km" });
  const transmission = useWatch({ control, name: "transmission" });

  const handleSave = handleSubmit(async (values) => {
    await onSubmit({
      brand: values.brand,
      model: values.model,
      year: values.year,
      km: parseInt(values.km, 10),
      transmission: values.transmission,
    });
    reset();
  });

  const yearNumber = Number(year);
  const kmNumber = Number(km);
  const isFormValid =
    !!brand &&
    !!model &&
    year.trim() &&
    Number.isFinite(yearNumber) &&
    km.trim() &&
    Number.isFinite(kmNumber) &&
    !!transmission;

  return (
    <BottomSheetView style={styles.contentContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <VStack style={{ padding: 16, gap: 16 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: Colors.textPrimary,
              marginBottom: 8,
            }}
          >
            Add Vehicle
          </Text>

          <VehicleFormFields control={control} setValue={setValue} />

          <Button
            size="md"
            style={{
              marginTop: 16,
              backgroundColor: isFormValid
                ? Colors.primary
                : Colors.borderDark,
            }}
            onPress={handleSave}
            isDisabled={!isFormValid}
          >
            <ButtonText style={{ color: "white" }}>
              Save to garage
            </ButtonText>
          </Button>
        </VStack>
      </KeyboardAvoidingView>
    </BottomSheetView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});
