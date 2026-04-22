import React, { useEffect, useState } from "react";
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
import { Spinner } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react-native";
import { Colors } from "../colors";
import { BrandSelect } from "@/components/CarSelection/BrandSelect";
import { ModelSelect } from "@/components/CarSelection/ModelSelect";
import { usePricePrediction } from "../hooks/query/predictionQueries";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm, useWatch } from "react-hook-form";
import { PredictCarPriceRequestDTO } from "@/types/requestDTOs.type";

export default function PredictScreen() {
  const [isPredicted, setIsPredicted] = useState(false);
  const [predictionParams, setPredictionParams] =
    useState<PredictCarPriceRequestDTO | null>(null);
  const scrollViewRef = React.useRef<ScrollView | null>(null);

  type PredictFormValues = {
    brand: string;
    model: string;
    year: string;
    km: string;
    transmission: string;
    fuel: string;
  };

  const { control, setValue, handleSubmit } = useForm<PredictFormValues>({
    mode: "onChange",
    defaultValues: {
      brand: "",
      model: "",
      year: "",
      km: "",
      transmission: "",
      fuel: "",
    },
  });

  const brand = useWatch({ control, name: "brand" });
  const model = useWatch({ control, name: "model" });
  const year = useWatch({ control, name: "year" });
  const km = useWatch({ control, name: "km" });
  const transmission = useWatch({ control, name: "transmission" });
  const fuel = useWatch({ control, name: "fuel" });

  const {
    data: predictionData,
    isFetching: predicting,
    isSuccess,
    dataUpdatedAt,
  } = usePricePrediction(
    predictionParams ??
      ({
        brand: "",
        model: "",
        year: "",
        km: 0,
        transmission: "",
        fuel: "",
      } as PredictCarPriceRequestDTO),
    !!predictionParams,
  );

  const yearNumber = Number(year);
  const kmNumber = Number(km);
  const isFormValid =
    !!brand &&
    !!model &&
    year.trim() &&
    Number.isFinite(yearNumber) &&
    km.trim() &&
    Number.isFinite(kmNumber) &&
    !!transmission &&
    !!fuel;

  const handlePredict = handleSubmit((values) => {
    setIsPredicted(true);
    setPredictionParams({
      brand: values.brand,
      model: values.model,
      year: values.year,
      km: parseInt(values.km, 10),
      transmission: values.transmission,
      fuel: values.fuel,
    });
  });

  useEffect(() => {
    if (isSuccess && dataUpdatedAt > 0 && scrollViewRef?.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [isSuccess, dataUpdatedAt, scrollViewRef]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.backgroundSecondary }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16 }}
          ref={scrollViewRef}
        >
          <VStack
            style={{
              gap: 16,
              backgroundColor: Colors.background,
              padding: 16,
              borderRadius: 16,
            }}
          >
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
                      keyboardType="numeric"
                      value={field.value}
                      onChangeText={field.onChange}
                      placeholder="e.g. 2024"
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
                      keyboardType="numeric"
                      value={field.value}
                      onChangeText={field.onChange}
                      placeholder="e.g. 50000"
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

            <VStack style={{ gap: 8 }}>
              <Text
                style={{
                  color: Colors.textSecondary,
                  fontSize: 12,
                  marginLeft: 4,
                }}
              >
                Fuel type
              </Text>
              <Controller
                control={control}
                name="fuel"
                render={({ field }) => (
                  <Select
                    selectedValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger variant="outline" size="md">
                      <SelectInput placeholder="Select Fuel type" />
                      <SelectIcon className="mr-3">
                        <ChevronDown size={16} />
                      </SelectIcon>
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectContent>
                        <SelectScrollView>
                          {["Benzene", "Diesel", "Electric", "Hybrid"].map(
                            (t) => (
                              <SelectItem key={t} label={t} value={t} />
                            ),
                          )}
                        </SelectScrollView>
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                )}
              />
            </VStack>

            <Button
              size="md"
              style={{ marginTop: 16, backgroundColor: Colors.primary }}
              isDisabled={!isFormValid || predicting}
              onPress={handlePredict}
            >
              {predicting && (
                <Spinner
                  size="small"
                  color="white"
                  style={{ marginRight: 8 }}
                />
              )}
              <ButtonText style={{ color: "white" }}>Predict price</ButtonText>
            </Button>
          </VStack>

          {isPredicted && predictionData && (
            <VStack style={{ marginTop: 24, gap: 16 }}>
              <Card
                style={{
                  borderLeftWidth: 3,
                  borderLeftColor: Colors.primary,
                  padding: 16,
                  backgroundColor: Colors.background,
                  borderTopWidth: 1,
                  borderRightWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: Colors.borderLight,
                }}
              >
                <Text style={{ fontSize: 14, color: Colors.textSecondary }}>
                  Estimated Value
                </Text>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "bold",
                    color: Colors.primaryDark,
                    marginTop: 8,
                  }}
                >
                  EGP {Number(predictionData.predicted_price).toLocaleString()}
                </Text>
              </Card>
            </VStack>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
