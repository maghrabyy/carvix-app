import { NavigationContainer } from "@react-navigation/native";
import RootStack from "@/router/StackNavigations/RootStack";

const Router = () => {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
};

export default Router;
