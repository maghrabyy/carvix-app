"use client";

import React from "react";
import { tva } from "@gluestack-ui/utils/nativewind-utils";
import { PrimitiveIcon, UIIcon } from "@gluestack-ui/core/icon/creator";
import type { VariantProps } from "@gluestack-ui/utils/nativewind-utils";
import { cssInterop } from "nativewind";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
  BottomSheetFlatList,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import {
  Pressable,
  type PressableProps,
  View,
  TextInput,
  Text,
  SectionList,
  VirtualizedList,
} from "react-native";

const SelectTriggerWrapper = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  React.ComponentProps<typeof Pressable>
>(function SelectTriggerWrapper({ ...props }, ref) {
  return <Pressable {...props} ref={ref} />;
});

const selectIconStyle = tva({
  base: "text-black bg-red-500 fill-none h-[18px] w-[18px]",
  variants: {
    size: {
      "2xs": "h-3 w-3",
      xs: "h-3.5 w-3.5",
      sm: "h-4 w-4",
      md: "h-[18px] w-[18px]",
      lg: "h-5 w-5",
      xl: "h-6 w-6",
    },
  },
});

const selectStyle = tva({
  base: "",
});

const selectTriggerStyle = tva({
  base: "border border-background-300 rounded flex-row items-center overflow-hidden data-[hover=true]:border-outline-400 data-[focus=true]:border-primary-700 data-[disabled=true]:opacity-40 data-[disabled=true]:data-[hover=true]:border-background-300",
  variants: {
    size: {
      xl: "min-h-12",
      lg: "min-h-11",
      md: "min-h-10",
      sm: "min-h-9",
    },
    variant: {
      underlined:
        "border-0 border-b rounded-none data-[hover=true]:border-primary-700 data-[focus=true]:border-primary-700 data-[focus=true]:web:shadow-[inset_0_-1px_0_0] data-[focus=true]:web:shadow-primary-700 data-[invalid=true]:border-error-700 data-[invalid=true]:web:shadow-error-700",
      outline:
        "data-[focus=true]:border-primary-700 data-[focus=true]:web:shadow-[inset_0_0_0_1px] data-[focus=true]:data-[hover=true]:web:shadow-primary-600 data-[invalid=true]:web:shadow-[inset_0_0_0_1px] data-[invalid=true]:border-error-700 data-[invalid=true]:web:shadow-error-700 data-[invalid=true]:data-[hover=true]:border-error-700",
      rounded:
        "rounded-full data-[focus=true]:border-primary-700 data-[focus=true]:web:shadow-[inset_0_0_0_1px] data-[focus=true]:web:shadow-primary-700 data-[invalid=true]:border-error-700 data-[invalid=true]:web:shadow-error-700",
    },
  },
});

const selectInputStyle = tva({
  base: "px-3 placeholder:text-typography-500 web:w-full h-full text-typography-900 pointer-events-none web:outline-none ios:leading-[0px] py-0",
  variants: {
    size: {
      xl: "text-xl",
      lg: "text-lg",
      md: "text-base",
      sm: "text-sm",
    },
    variant: {
      underlined: "px-0",
      outline: "",
      rounded: "px-4",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "outline",
  },
});

type SelectContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isDisabled: boolean;
  selectedValue?: string;
  selectedLabel?: string;
  setSelectedLabel: (value: string, label: string) => void;
  onValueChange?: (value: string) => void;
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

const useSelectContext = (): SelectContextValue => {
  const ctx = React.useContext(SelectContext);
  if (!ctx) {
    throw new Error("Select components must be used within Select");
  }
  return ctx;
};

type SelectProps = {
  children?: React.ReactNode;
  selectedValue?: string;
  selectedLabel?: string;
  onValueChange?: (value: string) => void;
  isDisabled?: boolean;
  className?: string;
};

function extractSelectItemLabels(
  node: React.ReactNode,
): Record<string, string> {
  const labels: Record<string, string> = {};

  type ItemLikeProps = {
    value?: unknown;
    label?: unknown;
    children?: React.ReactNode;
  };

  const visit = (n: React.ReactNode) => {
    if (!React.isValidElement(n)) return;
    const element = n as React.ReactElement<ItemLikeProps>;
    const props = element.props ?? {};

    // Collect labels from item-like elements even if the portal content
    // hasn't mounted yet (e.g. BottomSheetModal not presented). We avoid
    // relying on component identity checks here because some wrappers
    // (e.g. nativewind cssInterop) can alter the element type reference.
    if (typeof props.value === "string" && typeof props.label === "string") {
      labels[props.value] = props.label;
    }

    if (props.children) React.Children.forEach(props.children, visit);
  };

  React.Children.forEach(node, visit);
  return labels;
}

function Select({
  children,
  selectedValue,
  selectedLabel,
  onValueChange,
  isDisabled = false,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [labelMap, setLabelMap] = React.useState<Record<string, string>>({});

  const derivedLabelMap = React.useMemo(
    () => extractSelectItemLabels(children),
    [children],
  );

  const setSelectedLabel = React.useCallback((value: string, label: string) => {
    setLabelMap((prev) => {
      if (prev[value] === label) return prev;
      return { ...prev, [value]: label };
    });
  }, []);

  const effectiveLabelMap = React.useMemo(
    () => ({ ...derivedLabelMap, ...labelMap }),
    [derivedLabelMap, labelMap],
  );

  const contextValue = React.useMemo<SelectContextValue>(
    () => ({
      isOpen,
      isDisabled,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      selectedValue,
      selectedLabel:
        selectedLabel ??
        (selectedValue
          ? (effectiveLabelMap[selectedValue] ?? selectedValue)
          : undefined),
      setSelectedLabel,
      onValueChange,
    }),
    [
      isDisabled,
      isOpen,
      effectiveLabelMap,
      onValueChange,
      selectedLabel,
      selectedValue,
      setSelectedLabel,
    ],
  );

  return (
    <SelectContext.Provider value={contextValue}>
      <View className={selectStyle({ class: className })}>{children}</View>
    </SelectContext.Provider>
  );
}

type SelectPortalProps = {
  children?: React.ReactNode;
  snapPoints?: Array<number | string>;
  initialSnapIndex?: number;
};

const SelectPortal = React.forwardRef<BottomSheetModal, SelectPortalProps>(
  function SelectPortal({ children, snapPoints, initialSnapIndex = 0 }, ref) {
    const selectContext = useSelectContext();
    const { isOpen, close } = selectContext;
    const localRef = React.useRef<BottomSheetModal>(null);
    const mergedRef = React.useMemo(
      () => (node: BottomSheetModal | null) => {
        localRef.current = node;
        if (typeof ref === "function") {
          ref(node);
          return;
        }
        if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    React.useEffect(() => {
      if (isOpen) {
        localRef.current?.present();
      } else {
        localRef.current?.dismiss();
      }
    }, [isOpen]);

    const renderBackdrop = React.useCallback(
      (backdropProps: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...backdropProps}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={mergedRef}
        index={initialSnapIndex}
        onDismiss={close}
        snapPoints={snapPoints}
        enableDynamicSizing={!snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <SelectContext.Provider value={selectContext}>
          {children}
        </SelectContext.Provider>
      </BottomSheetModal>
    );
  },
);

const selectContentStyle = tva({
  base: "rounded-tl-3xl rounded-tr-3xl bg-background-0 max-h-[92vh]",
});

const SelectContent = React.forwardRef<
  React.ComponentRef<typeof View>,
  React.ComponentProps<typeof View> & { className?: string }
>(function SelectContent({ className, ...props }, ref) {
  return (
    <BottomSheetView className={selectContentStyle({ class: className })}>
      <View ref={ref} {...props} />
    </BottomSheetView>
  );
});

const SelectBackdrop = React.forwardRef<
  View,
  React.ComponentProps<typeof View>
>(function SelectBackdrop() {
  return null;
});

const selectItemStyle = tva({
  base: "w-full flex-row items-center px-4 py-3 rounded-sm data-[disabled=true]:opacity-40 active:bg-background-100",
});

const selectItemTextStyle = tva({
  base: "text-typography-700 font-normal font-body tracking-md text-left",
});

type SelectItemProps = React.ComponentProps<typeof Pressable> & {
  label?: string;
  value?: string;
  textValue?: string;
  className?: string;
};

const SelectItem = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  SelectItemProps
>(function SelectItem({ className, label, children, ...props }, ref) {
  const { close, onValueChange, setSelectedLabel } = useSelectContext();
  React.useEffect(() => {
    if (props.value && label) {
      setSelectedLabel(props.value, label);
    }
  }, [label, props.value, setSelectedLabel]);

  const handlePress = React.useCallback<NonNullable<PressableProps["onPress"]>>(
    (event) => {
      if (props.value) {
        onValueChange?.(props.value);
      }
      close();
      props.onPress?.(event);
    },
    [close, onValueChange, props],
  );

  return (
    <Pressable
      ref={ref}
      className={selectItemStyle({ class: className })}
      onPress={handlePress}
      {...props}
    >
      {children ?? (
        <Text className={selectItemTextStyle({})}>{label ?? ""}</Text>
      )}
    </Pressable>
  );
});

const SelectItemText = React.forwardRef<
  React.ComponentRef<typeof Text>,
  React.ComponentProps<typeof Text>
>(function SelectItemText({ className, ...props }, ref) {
  return (
    <Text
      ref={ref}
      className={selectItemTextStyle({ class: className })}
      {...props}
    />
  );
});

const SelectScrollView = React.forwardRef<
  React.ComponentRef<typeof BottomSheetScrollView>,
  React.ComponentProps<typeof BottomSheetScrollView> & { className?: string }
>(function SelectScrollView({ ...props }, ref) {
  return <BottomSheetScrollView ref={ref} {...props} />;
});

cssInterop(SelectTriggerWrapper, { className: "style" });
cssInterop(TextInput, {
  className: { target: "style", nativeStyleToProp: { textAlign: true } },
});
cssInterop(SelectContent, { className: "style" });
cssInterop(SelectItem, { className: "style" });
cssInterop(SelectItemText, { className: "style" });

cssInterop(PrimitiveIcon, {
  className: {
    target: "style",
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      color: "classNameColor",
      stroke: true,
    },
  },
});

type ISelectTriggerProps = VariantProps<typeof selectTriggerStyle> &
  React.ComponentProps<typeof Pressable> & { className?: string };

const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  ISelectTriggerProps
>(function SelectTrigger(
  { className, size = "md", variant = "outline", ...props },
  ref,
) {
  const { open, isDisabled } = useSelectContext();
  const triggerDisabled = props.disabled ?? isDisabled;
  return (
    <SelectTriggerWrapper
      className={selectTriggerStyle({
        class: className,
        size,
        variant,
      })}
      ref={ref}
      disabled={triggerDisabled}
      onPress={(event) => {
        props.onPress?.(event);
        if (!triggerDisabled) {
          open();
        }
      }}
      {...props}
    />
  );
});

type ISelectInputProps = VariantProps<typeof selectInputStyle> &
  React.ComponentProps<typeof TextInput> & { className?: string };

const SelectInput = React.forwardRef<
  React.ComponentRef<typeof TextInput>,
  ISelectInputProps
>(function SelectInput({ className, placeholder, ...props }, ref) {
  const { selectedLabel } = useSelectContext();
  return (
    <TextInput
      className={selectInputStyle({
        class: className,
        size: "md",
        variant: "outline",
      })}
      ref={ref}
      editable={false}
      pointerEvents="none"
      value={selectedLabel ?? ""}
      placeholder={placeholder}
      {...props}
    />
  );
});

type ISelectIcon = VariantProps<typeof selectIconStyle> &
  React.ComponentProps<typeof UIIcon> & { className?: string };

function SelectIcon({ className, size, ...props }: ISelectIcon) {
  if (typeof size === "number") {
    return (
      <UIIcon
        {...props}
        className={selectIconStyle({ class: className })}
        size={size}
      />
    );
  } else if (
    //@ts-expect-error : web only
    (props?.height !== undefined || props?.width !== undefined) &&
    size === undefined
  ) {
    return (
      <UIIcon {...props} className={selectIconStyle({ class: className })} />
    );
  }
  return (
    <UIIcon
      className={selectIconStyle({
        class: className,
        size,
      })}
      {...props}
    />
  );
}

const SelectVirtualizedList = VirtualizedList;
const SelectFlatList = BottomSheetFlatList;
const SelectSectionList = SectionList;
const SelectSectionHeaderText = Text;

export {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
  SelectScrollView,
  SelectVirtualizedList,
  SelectFlatList,
  SelectSectionList,
  SelectSectionHeaderText,
};
