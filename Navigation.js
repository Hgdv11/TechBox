// Navegación
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

// Tabs
import Home from "./screens/tabScreens/Home";
import Order from "./screens/tabScreens/Order";
import Return from "./screens/tabScreens/Return";

// icons

import Ionicons from "react-native-vector-icons/Ionicons";

//Screen
import Register from "./screens/Register";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { DrawerActions } from "@react-navigation/native";

//Drawer
const Drawer = createDrawerNavigator();

// Drawer Stuff

import CustomDrawer from "./Components/CustomDrawer";
import SwitchLanguage from "./Components/SwitchLanguage";

function DrawerGroup() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerLabelStyle: { marginLeft: 0 },
        drawerActiveBackgroundColor: "#4FD1C5",
        drawerActiveTintColor: "#fff",
      }}
    >
      <Drawer.Screen
        name="Pantalla principal"
        component={TabGroup}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home" size={22  } color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Cambiar idioma"
        component={SwitchLanguage}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="globe-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

// Tabs
const Tab = createBottomTabNavigator();

function TabGroup() {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerStyle: {
          backgroundColor: "#4FD1C5", 
        },
        headerTintColor: "black", 
        headerTitleAlign: "center", 
        headerTitleStyle: {
          fontWeight: "bold"
        },
        headerLeft: () => (
          <TouchableOpacity
            style={{ paddingLeft: 10, paddingRight: 10 }} 
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Ionicons name="reorder-three-outline" size={24} color="black" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <Image
            source={require("./assets/logo-nobg.png")}
            style={{ width: 40, height: 40, marginRight: 10 }}
          />
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Inicio") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Realizar pedido") {
            iconName = focused ? "cart" : "cart-outline";
          } else if (route.name === "Devolución") {
            iconName = focused ? "return-up-back" : "return-up-back-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={Home}
        options={{
          headerShown: true,
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="Realizar pedido"
        component={Order}
        options={{
          headerShown: true,
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="Devolución"
        component={Return}
        options={{
          headerShown: true,
          tabBarLabel: "",
        }}
      />
    </Tab.Navigator>
  );
}

// Stack
const Stack = createNativeStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Register"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="MainHome" component={DrawerGroup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
