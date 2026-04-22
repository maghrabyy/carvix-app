import React, { useMemo, useRef } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Trash2, Pencil, ChevronDown } from "lucide-react-native";
import { Colors } from "../colors";
import { VehiclePriceTrend } from "@/components/VehiclePriceTrend";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Controller, useForm, useWatch } from "react-hook-form";
import { BrandSelect } from "@/components/CarSelection/BrandSelect";
import { ModelSelect } from "@/components/CarSelection/ModelSelect";
import { Input, InputField } from "@/components/ui/input";
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
import { Button, ButtonText } from "@/components/ui/button";

interface VehicleCardProps {
  brand: string;
  model: string;
  year: number | string;
  price?: number;
  km?: number;
  transmission?: string;
  showPriceTrend?: boolean;
  showSavingsBadge?: boolean;
  isEditable?: boolean;
  onEdit?: (values: {
    brand: string;
    model: string;
    year: string;
    km: number;
    transmission: string;
  }) => void | Promise<void>;
  onDelete?: () => void;
}

export const VehicleCard = ({
  brand,
  model,
  year,
  price,
  km,
  transmission,
  showPriceTrend,
  showSavingsBadge,
  isEditable,
  onEdit,
  onDelete,
}: VehicleCardProps) => {
  const yearNumber = Number(year);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["60%", "92%"], []);

  type EditVehicleFormValues = {
    brand: string;
    model: string;
    year: string;
    km: string;
    transmission: string;
  };

  const { control, setValue, handleSubmit, reset } =
    useForm<EditVehicleFormValues>({
      mode: "onChange",
      defaultValues: {
        brand: brand ?? "",
        model: model ?? "",
        year: String(year ?? ""),
        km: km !== undefined ? String(km) : "",
        transmission: transmission ?? "",
      },
    });

  const editBrand = useWatch({ control, name: "brand" });
  const editModel = useWatch({ control, name: "model" });
  const editYear = useWatch({ control, name: "year" });
  const editKm = useWatch({ control, name: "km" });
  const editTransmission = useWatch({ control, name: "transmission" });

  const editYearNumber = Number(editYear);
  const editKmNumber = Number(editKm);
  const isEditFormValid =
    !!editBrand &&
    !!editModel &&
    editYear.trim() &&
    Number.isFinite(editYearNumber) &&
    editKm.trim() &&
    Number.isFinite(editKmNumber) &&
    !!editTransmission;

  const handleOpenEditSheet = () => {
    reset({
      brand: brand ?? "",
      model: model ?? "",
      year: String(year ?? ""),
      km: km !== undefined ? String(km) : "",
      transmission: transmission ?? "",
    });
    bottomSheetModalRef.current?.present();
  };

  const handleCloseEditSheet = () => bottomSheetModalRef.current?.dismiss();

  const handleSaveEdit = handleSubmit(async (values) => {
    if (!onEdit) return;
    await onEdit({
      brand: values.brand,
      model: values.model,
      year: values.year,
      km: parseInt(values.km, 10),
      transmission: values.transmission,
    });
    handleCloseEditSheet();
  });

  const shouldShowActions = !!onDelete || !!isEditable;

  return (
    <>
      <Card
        style={{
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: Colors.borderLight,
          backgroundColor: Colors.background,
        }}
      >
        <HStack
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
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

            {showPriceTrend && Number.isFinite(yearNumber) && (
              <VehiclePriceTrend
                brand={brand}
                model={model}
                year={yearNumber}
              />
            )}

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

          {shouldShowActions && (
            <HStack style={{ alignItems: "center", gap: 12 }}>
              {isEditable && (
                <Pencil
                  size={20}
                  color={Colors.primary}
                  onPress={handleOpenEditSheet}
                  style={{ padding: 8 }}
                />
              )}
              {onDelete && (
                <Trash2
                  size={20}
                  color={Colors.danger}
                  onPress={onDelete}
                  style={{ padding: 8 }}
                />
              )}
            </HStack>
          )}
        </HStack>
      </Card>

      {isEditable && (
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose
          backgroundStyle={{ backgroundColor: Colors.background }}
        >
          <BottomSheetView style={{ flex: 1 }}>
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
                  Edit Vehicle
                </Text>

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
                      brand={editBrand}
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

                <Button
                  size="md"
                  style={{
                    marginTop: 16,
                    backgroundColor: isEditFormValid
                      ? Colors.primary
                      : Colors.borderDark,
                  }}
                  onPress={handleSaveEdit}
                  isDisabled={!isEditFormValid || !onEdit}
                >
                  <ButtonText style={{ color: "white" }}>Save changes</ButtonText>
                </Button>
              </VStack>
            </KeyboardAvoidingView>
          </BottomSheetView>
        </BottomSheetModal>
      )}
    </>
  );
};
