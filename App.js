import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import Onboarding from "./screens/Onboarding";
import Profile from "./screens/Profile";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { getUser } from "./utils/Auth";
import Splash from "./screens/splash";
import Home from "./screens/Home";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [authentication, setAuthentication] = useState(false);

  const handleBoarding = () => {
    setAuthentication(true);
  };

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        await getUser().then((user) => {
          user !== null ? setAuthentication(true) : setAuthentication(false);
        });

        setIsLoading(false);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [authentication]);

  if (isLoading) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authentication ? (
          <>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Profile"
              component={Profile}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <Stack.Screen name="Onboarding" options={{ headerShown: false }}>
            {(props) => <Onboarding {...props} onBoard={handleBoarding} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
