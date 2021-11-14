import React from "react";
import BottomTabs from "./components/BottomTabs";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { NavigationContainer } from "@react-navigation/native";

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    );
  }
}

const AppSwitchNavigator = createSwitchNavigator({
  BottomTabs: BottomTabs,
});

const AppNavigator = createAppContainer(AppSwitchNavigator);
