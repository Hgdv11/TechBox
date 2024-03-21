import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import CustomDrawer from "../Components/CustomDrawer";

import LogOut from "../Components/LogOut";
import SwitchLanguage from "../Components/SwitchLanguage";

import Ionicons from "react-native-vector-icons/Ionicons";

const Drawer = createDrawerNavigator();

const DrawerNav = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerLabelStyle: { marginLeft: -20 },
        drawerActiveBackgroundColor: '#4FD1C5',
        drawerActiveTintColor: '#fff'
      }}
    >
      <Drawer.Screen
        name="Cambiar lenguaje"
        component={SwitchLanguage}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="globe-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Cerrar Sesión"
        component={LogOut}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="exit" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNav;
