import { Colors } from "@/colors";
import { Box } from "@/components/ui/box";
import { Input, InputField } from "@/components/ui/input";
import {
  Select,
  SelectFlatList,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ChevronDown } from "lucide-react-native";
import React, { useMemo, useState } from "react";

export type SearchableSelectItem = {
  label: string;
  value: string;
};

type SearchableSelectProps = {
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  items?: SearchableSelectItem[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  emptyText?: string;
  snapPoints?: Array<number | string>;
  initialSnapIndex?: number;
};

export function SearchableSelect({
  label,
  placeholder,
  searchPlaceholder,
  items,
  selectedValue,
  onValueChange,
  isLoading = false,
  isDisabled = false,
  emptyText = "No results",
  snapPoints,
  initialSnapIndex = 0,
}: SearchableSelectProps) {
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const list = items ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((i) => i.label.toLowerCase().includes(q));
  }, [items, search]);

  return (
    <VStack style={{ gap: 8 }}>
      <Text
        style={{
          color: Colors.textSecondary,
          fontSize: 12,
          marginLeft: 4,
        }}
      >
        {label}
      </Text>

      <Select
        selectedValue={selectedValue}
        onValueChange={(val) => {
          setSearch("");
          onValueChange(val);
        }}
        isDisabled={isDisabled}
      >
        <SelectTrigger variant="outline" size="md">
          <SelectInput placeholder={placeholder} />
          <SelectIcon className="mr-3">
            {isLoading ? <Spinner size="small" /> : <ChevronDown size={16} />}
          </SelectIcon>
        </SelectTrigger>

        <SelectPortal
          snapPoints={snapPoints}
          initialSnapIndex={initialSnapIndex}
        >
          <SelectFlatList
            data={filteredItems}
            renderItem={({ item }) => (
              <SelectItem
                key={item.value}
                label={item.label}
                value={item.value}
              />
            )}
            ListHeaderComponent={
              <Box style={{ paddingHorizontal: 8 }}>
                <Input
                  size="md"
                  variant="outline"
                  style={{
                    backgroundColor: Colors.backgroundSecondary,
                    width: "100%",
                  }}
                >
                  <InputField
                    value={search}
                    onChangeText={setSearch}
                    placeholder={searchPlaceholder}
                  />
                </Input>
              </Box>
            }
            stickyHeaderIndices={[0]}
            ListEmptyComponent={
              !isLoading ? (
                <Text
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    color: Colors.textSecondary,
                  }}
                >
                  {emptyText}
                </Text>
              ) : null
            }
          />
        </SelectPortal>
      </Select>
    </VStack>
  );
}
