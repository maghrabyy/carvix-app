import React, { useRef, useMemo } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
  SelectScrollView,
} from "@/components/ui/select";
import { Input, InputField } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Plus, Car, ChevronDown } from "lucide-react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Colors } from "../colors";
import { useVehicles } from "../hooks/useVehicles";
import { VehicleCard } from "../components/VehicleCard";
import { EmptyState } from "../components/EmptyState";
import { BrandSelect } from "@/components/CarSelection/BrandSelect";
import { ModelSelect } from "@/components/CarSelection/ModelSelect";
import { Controller, useForm, useWatch } from "react-hook-form";

export default function GarageScreen() {
  const { vehicles, loading, addVehicle, removeVehicle } = useVehicles();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["60%", "92%"], []);

  type GarageFormValues = {
    brand: string;
    model: string;
    year: string;
    km: string;
    transmission: string;
  };

  const { control, setValue, handleSubmit, reset } = useForm<GarageFormValues>({
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


  const handleOpenSheet = () => bottomSheetModalRef.current?.present();
  const handleCloseSheet = () => bottomSheetModalRef.current?.dismiss();

  const handleSave = handleSubmit(async (values) => {
    await addVehicle({
      brand: values.brand,
      model: values.model,
      year: values.year,
      km: parseInt(values.km, 10),
      transmission: values.transmission,
    });
    reset();
    handleCloseSheet();
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

  const renderContent = () => {
    if (loading) {
      return (
        <VStack
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner size="large" color={Colors.primary} />
        </VStack>
      );
    }

    if (vehicles.length === 0) {
      return (
        <VStack style={{ flex: 1, padding: 16, justifyContent: "center" }}>
          <EmptyState text="No vehicles saved yet" Icon={Car} />
        </VStack>
      );
    }

    return (
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <VehicleCard
            brand={item.brand}
            model={item.model}
            year={item.year}
            km={item.km}
            transmission={item.transmission}
            onDelete={() => removeVehicle(item.id)}
          />
        )}
      />
    );
  };

  return (
    <VStack style={{ flex: 1, backgroundColor: Colors.backgroundSecondary }}>
      {renderContent()}

      <Button
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: Colors.primary,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        onPress={handleOpenSheet}
      >
        <ButtonIcon as={Plus} size="xl" color="white" />
      </Button>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: Colors.background }}
      >
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
                        <SelectBackdrop />
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
      </BottomSheetModal>
    </VStack>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});
