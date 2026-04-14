import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./TabNavigations";

const Router = () => {
  return (
    <NavigationContainer>
      <TabNavigation />
    </NavigationContainer>
  );
};

export default Router;
