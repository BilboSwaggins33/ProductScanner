import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Scan from "../screens/Scan";
import Settings from "../screens/Settings";
const Stack = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Scan"
      activeColor="#fff"
    >
      <Tab.Screen
        name="Scan"
        component={Scan}
        options={{
          tabBarLabel: "Home",
          tabBarColor: '#3F51B5',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: "Settings",
          tabBarColor: '#3F51B5',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabScreen;
