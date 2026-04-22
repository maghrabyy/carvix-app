import React from "react";
import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
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
import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react-native";
import { Colors } from "../colors";
import { useVehicles } from "../hooks/useVehicles";
import { BrandSelect } from "@/components/CarSelection/BrandSelect";
import { ModelSelect } from "@/components/CarSelection/ModelSelect";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/router.type";
import MarketAlternativeResults from "@/components/Compare Screen/MarketAlternativeResults";
import { Controller, useForm, useWatch } from "react-hook-form";
import SegmentedTabs from "@/components/SegmentedTabs";

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

type CompareFormValues = {
  mode: "garage" | "manual";
  selectedVehicleId: string;
  brand: string;
  model: string;
  year: string;
  km: string;
  transmission: string;
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
  const { vehicles } = useVehicles();
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

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  const selectedVehicleLabel = selectedVehicle
    ? `${selectedVehicle?.brand} ${selectedVehicle?.model} (${selectedVehicle?.year})`
    : "Select Vehicle";

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
              onPress={() => navigation.push("Garage")}
            >
              <ButtonText style={{ color: "white" }}>Go to Garage</ButtonText>
            </Button>
          </Card>
        )}

        {/* Mode Toggle */}
        <SegmentedTabs
          value={mode}
          onChange={(val) => setValue("mode", val)}
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
                onValueChange={(v) => setValue("selectedVehicleId", v)}
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

              {/* YEAR */}
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
                        keyboardType="numeric"
                        value={field.value}
                        onChangeText={field.onChange}
                        placeholder="e.g. 2024"
                      />
                    )}
                  />
                </Input>
              </VStack>

              {/* KM */}
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
                        keyboardType="numeric"
                        value={field.value}
                        onChangeText={field.onChange}
                        placeholder="e.g. 50000"
                      />
                    )}
                  />
                </Input>
              </VStack>

              {/* TRANSMISSION */}
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
          )}

          {/* SELLING PRICE */}
          <VStack style={{ gap: 8, marginTop: 8 }}>
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
