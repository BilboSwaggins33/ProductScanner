import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Scan from "../screens/Scan";
import Results from "../screens/Results"
import Settings from "../screens/Settings";
const Stack = createStackNavigator();

const Tab = createMaterialBottomTabNavigator();

function Dashboard() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{
      headerStyle: {
        height: 60,
        backgroundColor: "#000"
      }
    }}>
      <Stack.Screen name="Home" component={Scan} options={{ title: ' ' }} />
      <Stack.Screen name="Results" component={Results} />
    </Stack.Navigator >
  )
}


const MainTabScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Scan"
      activeColor="#fff"

    >
      <Tab.Screen
        name="Scan"
        component={Dashboard}
        options={{
          tabBarLabel: "Home",
          tabBarColor: '#3F51B5',
          tabBarIcon: () => (
            <MaterialIcons name="home" size={18} color={"white"} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: "Settings",
          tabBarColor: '#3F51B5',
          tabBarIcon: () => (
            <MaterialIcons name="settings" size={18} color={"white"} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabScreen;
