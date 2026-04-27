import React from "react";
import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { Colors } from "../colors";
import { useVehicles } from "../hooks/useVehicles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "@/types/router.type";
import MarketAlternativeResults from "@/components/Compare Screen/MarketAlternativeResults";
import { ComparisonOptions } from "@/components/Compare Screen/ComparisonOptions";
import { Controller, useForm, useWatch } from "react-hook-form";
import { VehicleFieldValues } from "@/components/VehicleFormFields";

const parseNumber = (value?: string): number | undefined => {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
};

const rangeError = (from?: string, to?: string): string | undefined => {
  const fromN = parseNumber(from);
  const toN = parseNumber(to);
  if (fromN === undefined || toN === undefined) return undefined;
  return fromN > toN ? "From must not exceed To" : undefined;
};

type CompareFormValues = VehicleFieldValues & {
  mode: "garage" | "manual";
  selectedVehicleId: string;
  sellingPrice: string;
  sameBrand: boolean;
  sameTransmission: boolean;
  sameYear: boolean;
  yearFrom: string;
  yearTo: string;
  kmFrom: string;
  kmTo: string;
};

export default function CompareScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<RootStackParamList, "mainTab">;
}) {
  const { vehicles, reloadVehicles } = useVehicles();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const { control, setValue } = useForm<CompareFormValues>({
    mode: "onChange",
    defaultValues: {
      mode: "manual",
      selectedVehicleId: "",
      brand: "",
      model: "",
      year: "",
      km: "",
      transmission: "",
      sellingPrice: "",
      sameBrand: false,
      sameTransmission: false,
      sameYear: false,
      yearFrom: "",
      yearTo: "",
      kmFrom: "",
      kmTo: "",
    },
  });

  const mode = useWatch({ control, name: "mode" });
  const selectedVehicleId = useWatch({ control, name: "selectedVehicleId" });
  const brand = useWatch({ control, name: "brand" });
  const model = useWatch({ control, name: "model" });
  const year = useWatch({ control, name: "year" });
  const km = useWatch({ control, name: "km" });
  const transmission = useWatch({ control, name: "transmission" });
  const sellingPrice = useWatch({ control, name: "sellingPrice" });

  const sameBrand = useWatch({ control, name: "sameBrand" });
  const sameTransmission = useWatch({ control, name: "sameTransmission" });
  const sameYear = useWatch({ control, name: "sameYear" });
  const yearFrom = useWatch({ control, name: "yearFrom" });
  const yearTo = useWatch({ control, name: "yearTo" });
  const kmFrom = useWatch({ control, name: "kmFrom" });
  const kmTo = useWatch({ control, name: "kmTo" });

  const yearRangeError = sameYear
    ? undefined
    : rangeError(yearFrom.trim() || undefined, yearTo.trim() || undefined);
  const kmRangeError = rangeError(
    kmFrom.trim() || undefined,
    kmTo.trim() || undefined,
  );
  const isComparisonFiltersValid = !yearRangeError && !kmRangeError;

  const yearNumber = Number(year);
  const kmNumber = Number(km);
  const sellingPriceNumber = Number(sellingPrice);

  const isFormValid =
    mode === "manual"
      ? Boolean(
          brand &&
          model &&
          year.trim() &&
          Number.isFinite(yearNumber) &&
          km.trim() &&
          Number.isFinite(kmNumber) &&
          sellingPrice.trim() &&
          Number.isFinite(sellingPriceNumber),
        )
      : Boolean(
          selectedVehicleId &&
          sellingPrice.trim() &&
          Number.isFinite(sellingPriceNumber),
        );

  useFocusEffect(
    React.useCallback(() => {
      reloadVehicles();
    }, [reloadVehicles]),
  );

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  const selectedVehicleLabel = selectedVehicle
    ? `${selectedVehicle?.brand} ${selectedVehicle?.model} (${selectedVehicle?.year})`
    : "Select Vehicle";

  React.useEffect(() => {
    if (mode !== "garage") return;
    if (!selectedVehicleId) return;
    if (!selectedVehicle) setValue("selectedVehicleId", "");
  }, [mode, selectedVehicleId, selectedVehicle, setValue]);

  // Cast control/setValue to VehicleFieldValues for the shared form fields component
  const vehicleControl =
    control as unknown as import("react-hook-form").Control<VehicleFieldValues>;
  const vehicleSetValue =
    setValue as unknown as import("react-hook-form").UseFormSetValue<VehicleFieldValues>;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        style={{ backgroundColor: Colors.backgroundSecondary }}
        ref={scrollViewRef}
      >
        <ComparisonOptions
          mode={mode}
          onModeChange={(val) => setValue("mode", val)}
          vehicles={vehicles}
          selectedVehicleId={selectedVehicleId}
          onSelectedVehicleChange={(v) => setValue("selectedVehicleId", v)}
          selectedVehicleLabel={selectedVehicleLabel}
          control={vehicleControl}
          setValue={vehicleSetValue}
          onNavigateToGarage={() => navigation.push("Garage")}
        />

        {/* SELLING PRICE — shared between both modes */}
        <VStack
          style={{
            gap: 8,
            marginTop: 16,
            backgroundColor: Colors.background,
            padding: 16,
            borderRadius: 16,
          }}
        >
          <Text
            style={{
              color: Colors.textSecondary,
              fontSize: 12,
              marginLeft: 4,
            }}
          >
            Your selling price (EGP)
          </Text>
          <Input
            size="md"
            variant="outline"
            style={{ backgroundColor: Colors.backgroundSecondary }}
          >
            <Controller
              control={control}
              name="sellingPrice"
              render={({ field }) => (
                <InputField
                  keyboardType="numeric"
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder="0"
                />
              )}
            />
          </Input>
        </VStack>

        {/* RESULTS */}
        <MarketAlternativeResults
          sellingPrice={
            Number.isFinite(sellingPriceNumber) ? sellingPriceNumber : 0
          }
          scrollViewRef={scrollViewRef}
          isComparisonFiltersValid={isComparisonFiltersValid}
          comparisonFilters={{
            sameBrand: !!sameBrand,
            setSameBrand: (val) => setValue("sameBrand", val),
            sameTransmission: !!sameTransmission,
            setSameTransmission: (val) => setValue("sameTransmission", val),
            sameYear: !!sameYear,
            setSameYear: (val) => setValue("sameYear", val),
            yearFrom: yearFrom ?? "",
            setYearFrom: (val) => setValue("yearFrom", val),
            yearTo: yearTo ?? "",
            setYearTo: (val) => setValue("yearTo", val),
            kmFrom: kmFrom ?? "",
            setKmFrom: (val) => setValue("kmFrom", val),
            kmTo: kmTo ?? "",
            setKmTo: (val) => setValue("kmTo", val),
            yearRangeError,
            kmRangeError,
          }}
          vehicleData={
            mode === "garage"
              ? {
                  brand: selectedVehicle?.brand || "",
                  model: selectedVehicle?.model || "",
                  year: Number(selectedVehicle?.year) || 0,
                  km: selectedVehicle?.km || 0,
                  transmission: selectedVehicle?.transmission as
                    | "automatic"
                    | "manual",
                }
              : {
                  brand,
                  model,
                  year: Number.isFinite(yearNumber) ? yearNumber : 0,
                  km: Number.isFinite(kmNumber) ? kmNumber : 0,
                  transmission: transmission as "automatic" | "manual",
                }
          }
          isFormValid={isFormValid}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
