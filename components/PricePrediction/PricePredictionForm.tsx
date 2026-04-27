import React from "react";
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
import { ChevronDown } from "lucide-react-native";
import { Colors } from "@/colors";
import { BrandSelect } from "@/components/CarSelection/BrandSelect";
import { ModelSelect } from "@/components/CarSelection/ModelSelect";
import { Controller, useForm, useWatch } from "react-hook-form";
import { PredictCarPriceRequestDTO } from "@/types/requestDTOs.type";

type PredictFormValues = {
  brand: string;
  model: string;
  year: string;
  km: string;
  transmission: string;
  fuel: string;
};

type PricePredictionFormProps = {
  predicting?: boolean;
  onPredict: (dto: PredictCarPriceRequestDTO) => void;
};

export function PricePredictionForm({
  predicting = false,
  onPredict,
}: PricePredictionFormProps) {
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
  const year = useWatch({ control, name: "year" });
  const km = useWatch({ control, name: "km" });
  const transmission = useWatch({ control, name: "transmission" });
  const fuel = useWatch({ control, name: "fuel" });
  const model = useWatch({ control, name: "model" });

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
    onPredict({
      brand: values.brand,
      model: values.model,
      year: values.year,
      km: parseInt(values.km, 10),
      transmission: values.transmission,
      fuel: values.fuel,
    });
  });

  return (
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
            isDisabled={predicting}
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
            isDisabled={predicting || !brand}
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
                editable={!predicting}
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
                editable={!predicting}
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
              isDisabled={predicting}
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
              isDisabled={predicting}
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
                    {["Benzene", "Diesel", "Electric", "Hybrid"].map((t) => (
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
        style={{ marginTop: 16, backgroundColor: Colors.primary }}
        isDisabled={!isFormValid || predicting}
        onPress={handlePredict}
      >
        {predicting && (
          <Spinner size="small" color="white" style={{ marginRight: 8 }} />
        )}
        <ButtonText style={{ color: "white" }}>Predict price</ButtonText>
      </Button>
    </VStack>
  );
}
