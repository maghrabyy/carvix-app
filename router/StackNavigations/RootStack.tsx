import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GarageScreen from "@/screens/GarageScreen";
import TabNavigation from "@/router/TabNavigations";

const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="mainTab"
        component={TabNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Garage"
        component={GarageScreen}
        options={{ title: "My Garage" }}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
