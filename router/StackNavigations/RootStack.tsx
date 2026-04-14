import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PricePredictionScreen from "../../screens/PricePredictionScreen";

const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PricePrediction" component={PricePredictionScreen} />
    </Stack.Navigator>
  );
};

export default RootStack;
