import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Vehicle } from "../types/vehicle.type";
import uuid from "react-native-uuid";

const VEHICLES_STORAGE_KEY = "vehicles";

export function useVehicles(): {
  vehicles: Vehicle[];
  reloadVehicles: () => Promise<void>;
  addVehicle: (v: Omit<Vehicle, "id">) => Promise<void>;
  updateVehicle: (id: string, v: Omit<Vehicle, "id">) => Promise<void>;
  removeVehicle: (id: string) => Promise<void>;
  loading: boolean;
} {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const loadVehicles = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(VEHICLES_STORAGE_KEY);
      if (stored) {
        setVehicles(JSON.parse(stored));
      } else {
        setVehicles([]);
      }
    } catch (err) {
      console.error("Failed to load vehicles", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const addVehicle = async (v: Omit<Vehicle, "id">) => {
    try {
      const newVehicle: Vehicle = {
        ...v,
        id: uuid.v4().toString(),
      };
      const updatedList = [...vehicles, newVehicle];
      setVehicles(updatedList);
      await AsyncStorage.setItem(
        VEHICLES_STORAGE_KEY,
        JSON.stringify(updatedList),
      );
      loadVehicles(); // Refresh the list after adding
    } catch (err) {
      console.error("Failed to add vehicle", err);
    }
  };

  const removeVehicle = async (id: string) => {
    try {
      const updatedList = vehicles.filter((v) => v.id !== id);
      setVehicles(updatedList);
      await AsyncStorage.setItem(
        VEHICLES_STORAGE_KEY,
        JSON.stringify(updatedList),
      );
      loadVehicles(); // Refresh the list after removing
    } catch (err) {
      console.error("Failed to remove vehicle", err);
    }
  };

  const updateVehicle = async (id: string, v: Omit<Vehicle, "id">) => {
    try {
      const updatedList = vehicles.map((vehicle) =>
        vehicle.id === id ? { ...vehicle, ...v } : vehicle,
      );
      setVehicles(updatedList);
      await AsyncStorage.setItem(
        VEHICLES_STORAGE_KEY,
        JSON.stringify(updatedList),
      );
      loadVehicles(); // Refresh the list after updating
    } catch (err) {
      console.error("Failed to update vehicle", err);
    }
  };

  return {
    vehicles,
    reloadVehicles: loadVehicles,
    addVehicle,
    updateVehicle,
    removeVehicle,
    loading,
  };
}
