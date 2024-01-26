import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-native-paper";
import BottomTab from "./components/BottomTab";
import { BleProvider } from "./contexts/BleContext";

const App = () => {
  return (
    <Provider>
      <NavigationContainer>
        <BleProvider>
          <BottomTab />
        </BleProvider>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
