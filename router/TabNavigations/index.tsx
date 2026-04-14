import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PricePredictionScreen from "../../screens/PricePredictionScreen";
import { BanknoteArrowUp } from "lucide-react-native";

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="pricePrediction"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="pricePrediction"
        options={{
          tabBarIcon: () => <BanknoteArrowUp color="#1C3376" />,
          tabBarLabel: "Price Prediction",
          tabBarLabelStyle: { color: "#1C3376" },
        }}
        component={PricePredictionScreen}
      />
      <Tab.Screen
        name="carComparison"
        options={{
          tabBarIcon: () => <BanknoteArrowUp color="#1C3376" />,
          tabBarLabel: "Car Comparison",
          tabBarLabelStyle: { color: "#1C3376" },
        }}
        component={PricePredictionScreen}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
