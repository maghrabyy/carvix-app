import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GarageScreen from "@/screens/GarageScreen";
import TabNavigation from "@/router/TabNavigations";
import BudgetRecommendationScreen from "@/screens/BudgetRecommendationScreen";

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
      <Stack.Screen
        name="BudgetRecommendation"
        component={BudgetRecommendationScreen}
        options={{ title: "Budget Finder" }}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
