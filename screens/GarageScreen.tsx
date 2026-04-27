import React, { useRef, useMemo } from "react";
import { FlatList } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Plus, Car } from "lucide-react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Colors } from "../colors";
import { useVehicles } from "../hooks/useVehicles";
import { VehicleCard } from "../components/VehicleCard";
import { EmptyState } from "../components/EmptyState";
import { AddVehicleForm } from "../components/AddVehicleForm";

export default function GarageScreen() {
  const { vehicles, loading, addVehicle, updateVehicle, removeVehicle } =
    useVehicles();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["60%", "92%"], []);

  const handleOpenSheet = () => bottomSheetModalRef.current?.present();
  const handleCloseSheet = () => bottomSheetModalRef.current?.dismiss();

  const handleAddVehicle = async (values: {
    brand: string;
    model: string;
    year: string;
    km: number;
    transmission: string;
  }) => {
    await addVehicle(values);
    handleCloseSheet();
  };

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
            isEditable
            onEdit={(values) => updateVehicle(item.id, values)}
            onDelete={() => removeVehicle(item.id)}
            showPriceTrend
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
        <AddVehicleForm onSubmit={handleAddVehicle} />
      </BottomSheetModal>
    </VStack>
  );
}
