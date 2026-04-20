import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import Router from "./router";
import { QueryProvider } from "./API/react-query";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";

export default function App() {
  return (
    <GluestackUIProvider mode="light">
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryProvider>
          <BottomSheetModalProvider>
            <Router />
          </BottomSheetModalProvider>
        </QueryProvider>
      </GestureHandlerRootView>
    </GluestackUIProvider>
  );
}
