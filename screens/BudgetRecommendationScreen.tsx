import React, { useState } from "react";
import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller, useForm } from "react-hook-form";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
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
import { ChevronDown, SlidersHorizontal, Tag } from "lucide-react-native";
import { Colors } from "../colors";
import { BrandSelect } from "@/components/CarSelection/BrandSelect";
import { VehicleCard } from "@/components/VehicleCard";
import { useBudgetRecommendation } from "@/hooks/query/useCarQueries";
import { GetBudgetRecommendationRequestDTO } from "@/types/requestDTOs.type";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types/router.type";

type SortOption = NonNullable<GetBudgetRecommendationRequestDTO["sort_by"]>;

type BudgetFormValues = {
  budget: string;
  brand: string;
  sort_by: SortOption | "";
};

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Price: High to Low", value: "avg_price_desc" },
  { label: "Price: Low to High", value: "avg_price_asc" },
  { label: "Newest First", value: "model_year_desc" },
  { label: "Oldest First", value: "model_year_asc" },
  { label: "Most Popular", value: "most_popular" },
  { label: "Least Popular", value: "least_popular" },
];

export default function BudgetRecommendationScreen({
  route,
}: NativeStackScreenProps<RootStackParamList, "BudgetRecommendation">) {
  const [queryParams, setQueryParams] =
    useState<GetBudgetRecommendationRequestDTO | null>(null);

  const params = route.params;

  const budget = params?.budget ?? 0;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    mode: "onChange",
    defaultValues: {
      budget: budget.toString(),
      brand: "",
      sort_by: "",
    },
  });

  const { data, isFetching, isError } = useBudgetRecommendation(
    queryParams ?? { budget: 0 },
    !!queryParams,
  );

  const onSubmit = (values: BudgetFormValues) => {
    setQueryParams({
      budget: Number(values.budget),
      brand: values.brand || undefined,
      sort_by: (values.sort_by as SortOption) || undefined,
    });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors.backgroundSecondary }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <VStack style={{ paddingTop: 8, paddingBottom: 20 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: Colors.textPrimary,
              }}
            >
              Budget Finder
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: Colors.textSecondary,
                marginTop: 4,
              }}
            >
              Discover vehicles that match your budget
            </Text>
          </VStack>

          {/* Filters Card */}
          <Card
            style={{
              padding: 16,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: Colors.borderLight,
              backgroundColor: Colors.background,
              marginBottom: 24,
            }}
          >
            <VStack style={{ gap: 16 }}>
              {/* Budget Input */}
              <VStack style={{ gap: 8 }}>
                <HStack style={{ alignItems: "center", gap: 6 }}>
                  <Tag size={14} color={Colors.textSecondary} />
                  <Text
                    style={{
                      color: Colors.textSecondary,
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    Your Budget (EGP)
                  </Text>
                </HStack>
                <Controller
                  control={control}
                  name="budget"
                  rules={{
                    required: "Budget is required",
                    validate: (val) =>
                      (Number.isFinite(Number(val)) && Number(val) > 0) ||
                      "Enter a valid positive number",
                  }}
                  render={({ field }) => (
                    <Input
                      size="md"
                      variant="outline"
                      style={{
                        backgroundColor: Colors.backgroundSecondary,
                        borderColor: errors.budget
                          ? Colors.danger
                          : Colors.border,
                      }}
                    >
                      <InputField
                        keyboardType="numeric"
                        value={field.value}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                        placeholder="e.g. 500000"
                      />
                    </Input>
                  )}
                />
                {errors.budget && (
                  <Text
                    style={{
                      color: Colors.danger,
                      fontSize: 12,
                      marginLeft: 4,
                    }}
                  >
                    {errors.budget.message}
                  </Text>
                )}
              </VStack>

              {/* Brand Filter */}
              <Controller
                control={control}
                name="brand"
                render={({ field }) => (
                  <BrandSelect value={field.value} onChange={field.onChange} />
                )}
              />

              {/* Sort By */}
              <VStack style={{ gap: 8 }}>
                <HStack style={{ alignItems: "center", gap: 6 }}>
                  <SlidersHorizontal size={14} color={Colors.textSecondary} />
                  <Text
                    style={{
                      color: Colors.textSecondary,
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    Sort By (Optional)
                  </Text>
                </HStack>
                <Controller
                  control={control}
                  name="sort_by"
                  render={({ field }) => (
                    <Select
                      selectedValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger variant="outline" size="md">
                        <SelectInput placeholder="Default order" />
                        <SelectIcon className="mr-3">
                          <ChevronDown size={16} />
                        </SelectIcon>
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectContent>
                          <SelectScrollView>
                            {SORT_OPTIONS.map((opt) => (
                              <SelectItem
                                key={opt.value}
                                label={opt.label}
                                value={opt.value}
                              />
                            ))}
                          </SelectScrollView>
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                  )}
                />
              </VStack>

              {/* Search Button */}
              <Button
                size="md"
                style={{
                  marginTop: 4,
                  backgroundColor: Colors.primary,
                }}
                isDisabled={isFetching}
                onPress={handleSubmit(onSubmit)}
              >
                {isFetching && (
                  <Spinner
                    size="small"
                    color="white"
                    style={{ marginRight: 8 }}
                  />
                )}
                <ButtonText style={{ color: "white", fontWeight: "600" }}>
                  {isFetching ? "Searching..." : "Find Vehicles"}
                </ButtonText>
              </Button>
            </VStack>
          </Card>

          {/* Error State */}
          {isError && (
            <Card
              style={{
                padding: 16,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: Colors.dangerLight,
                backgroundColor: Colors.dangerLight,
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  color: Colors.danger,
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                Something went wrong. Please try again.
              </Text>
            </Card>
          )}

          {/* Results */}
          {data && (
            <VStack style={{ gap: 12 }}>
              <HStack
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 4,
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: Colors.textPrimary,
                  }}
                >
                  {data.recommendations.length > 0
                    ? `${data.recommendations.length} Matches Found`
                    : "No Matches Found"}
                </Text>
                {data.brandFilter && (
                  <Text style={{ fontSize: 12, color: Colors.textTertiary }}>
                    Brand: {data.brandFilter}
                  </Text>
                )}
              </HStack>

              {data.recommendations.length === 0 && (
                <Card
                  style={{
                    padding: 24,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: Colors.borderLight,
                    backgroundColor: Colors.background,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: Colors.textSecondary,
                      textAlign: "center",
                    }}
                  >
                    No vehicles found within your budget.{"\n"}Try increasing
                    your budget or removing filters.
                  </Text>
                </Card>
              )}
              <VStack>
                {data.recommendations.map((vehicle, index) => (
                  <VehicleCard
                    key={`${vehicle.brand}-${vehicle.model}-${vehicle.year}-${index}`}
                    brand={vehicle.brand}
                    model={vehicle.model}
                    year={vehicle.year}
                    price={vehicle.avgPrice}
                  />
                ))}
              </VStack>
            </VStack>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
