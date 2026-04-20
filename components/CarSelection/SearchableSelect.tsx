import { Colors } from "@/colors";
import { Input, InputField } from "@/components/ui/input";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectScrollView,
  SelectTrigger,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ChevronDown } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

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

        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <KeyboardAvoidingView
              style={{ width: "100%" }}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <VStack style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
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
              </VStack>

              <SelectScrollView>
                {filteredItems.map((i) => (
                  <SelectItem key={i.value} label={i.label} value={i.value} />
                ))}

                {!isLoading && filteredItems.length === 0 && (
                  <Text
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      color: Colors.textSecondary,
                    }}
                  >
                    {emptyText}
                  </Text>
                )}
              </SelectScrollView>
            </KeyboardAvoidingView>
          </SelectContent>
        </SelectPortal>
      </Select>
    </VStack>
  );
}
