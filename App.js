import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Register from "./screens/Register";
import HomeTabs from "./screens/HomeTabs";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }}/>
        <Stack.Screen name="HomeTabs" component={HomeTabs}  options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
