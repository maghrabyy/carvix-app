import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCarBrands } from "../hooks/query/useCarQueries";

function PricePredictionScreen() {
  const { data } = useCarBrands();
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => <Text>{item}</Text>}
        scrollEnabled
        style={{ width: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default PricePredictionScreen;
