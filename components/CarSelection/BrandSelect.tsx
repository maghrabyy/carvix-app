import { useCarBrands } from "@/hooks/query/useCarQueries";
import React, { useMemo } from "react";
import { SearchableSelect } from "./SearchableSelect";

type BrandSelectProps = {
  value: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
};

export function BrandSelect({ value, onChange, isDisabled }: BrandSelectProps) {
  const { data: brands, isLoading } = useCarBrands();

  const items = useMemo(
    () => (brands ?? []).map((b) => ({ label: b, value: b })),
    [brands],
  );

  return (
    <SearchableSelect
      label="Brand"
      placeholder="Select Brand"
      searchPlaceholder="Search brands..."
      items={items}
      selectedValue={value}
      onValueChange={onChange}
      isLoading={isLoading}
      isDisabled={isDisabled}
      emptyText="No brands found"
    />
  );
}

