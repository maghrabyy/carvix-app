import React from "react";
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
import { Controller, useForm } from "react-hook-form";
import { GetBudgetRecommendationRequestDTO } from "@/types/requestDTOs.type";

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

interface BudgetRecommendationFormProps {
  defaultBudget: number;
  isFetching: boolean;
  onSubmit: (params: GetBudgetRecommendationRequestDTO) => void;
}

export const BudgetRecommendationForm = ({
  defaultBudget,
  isFetching,
  onSubmit,
}: BudgetRecommendationFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    mode: "onChange",
    defaultValues: {
      budget: defaultBudget.toString(),
      brand: "",
      sort_by: "",
    },
  });

  const handleFormSubmit = handleSubmit((values) => {
    onSubmit({
      budget: Number(values.budget),
      brand: values.brand || undefined,
      sort_by: (values.sort_by as SortOption) || undefined,
    });
  });

  return (
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
          onPress={handleFormSubmit}
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
  );
};
