import { useCarModels } from "@/hooks/query/useCarQueries";
import React, { useMemo } from "react";
import { SearchableSelect } from "./SearchableSelect";

type ModelSelectProps = {
  brand: string;
  value: string;
  onChange: (value: string) => void;
  isDisabled?: boolean;
};

export function ModelSelect({
  brand,
  value,
  onChange,
  isDisabled,
}: ModelSelectProps) {
  const { data: models, isFetching } = useCarModels({ brand }, !!brand);

  const items = useMemo(
    () => (models ?? []).map((m) => ({ label: m, value: m })),
    [models],
  );
  const snapPoints = useMemo(() => ["50%", "75%", "92%"], []);

  return (
    <SearchableSelect
      label="Model"
      placeholder="Select Model"
      searchPlaceholder="Search models..."
      items={items}
      selectedValue={value}
      onValueChange={onChange}
      isLoading={isFetching}
      isDisabled={isDisabled || !brand || isFetching}
      emptyText={brand ? "No models found" : "Select a brand first"}
      snapPoints={snapPoints}
      initialSnapIndex={1}
    />
  );
}

