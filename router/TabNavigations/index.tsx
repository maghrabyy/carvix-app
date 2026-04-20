import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BarChart2, Zap, GitCompare, Car } from "lucide-react-native";
import { Colors } from "../../colors";
import InsightsScreen from "../../screens/InsightsScreen";
import PredictScreen from "../../screens/PredictScreen";
import { Button, ButtonIcon } from "@/components/ui/button";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/router.type";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CompareScreen from "@/screens/CompareScreen";

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Tab.Navigator
      initialRouteName="Predict"
      screenOptions={{
        headerRightContainerStyle: { paddingRight: 8 },
        headerRight: () => (
          <Button
            className="rounded-full"
            variant="outline"
            onPress={() => navigation.navigate("Garage")}
          >
            <ButtonIcon as={Car} />
          </Button>
        ),
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="Insights"
        component={InsightsScreen}
        options={{
          title: "Market Insights",
          tabBarIcon: ({ color }) => <BarChart2 color={color} />,
          tabBarLabel: "Insights",
        }}
      />
      <Tab.Screen
        name="Predict"
        component={PredictScreen}
        options={{
          title: "Price Prediction",
          tabBarIcon: ({ color }) => <Zap color={color} />,
          tabBarLabel: "Predict",
        }}
      />
      <Tab.Screen
        name="Compare"
        component={CompareScreen}
        options={{
          title: "Price Comparison",
          tabBarIcon: ({ color }) => <GitCompare color={color} />,
          tabBarLabel: "Compare",
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
