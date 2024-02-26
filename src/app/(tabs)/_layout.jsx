import React, { useRef } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs, useNavigation } from "expo-router";
import { DrawerLayoutAndroid, Pressable } from "react-native";

import Colors from "@/src/constants/Colors";
import { useColorScheme } from "@/src/components/useColorScheme";
import { useClientOnlyValue } from "@/src/components/useClientOnlyValue";
import { NavigationView } from "@/src/components/navigationView";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
/**
 * @param {{
 *   name: import("react-native-vector-icons/FontAwesome").IconName;
 *   color: string;
 *   size: number;
 *   style: import("react-native-vector-icons/FontAwesome").IconStyle;
 * }} props
 */
function TabBarIcon(props) {
  return <FontAwesome {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const drawerRef = useRef();
  const navigation = useNavigation();

  const generateTabScreenOptions = (title, iconName) => ({
    title: title,
    tabBarIcon: ({ color }) => (
      <TabBarIcon name={iconName} color={color} size={24} style={{}} />
    ),
    headerRight: () => (
      <Link href="/profile" asChild>
        <Pressable>
          {({ pressed }) => (
            <FontAwesome
              name="user"
              size={24}
              color={Colors[colorScheme ?? "light"].text}
              style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
            />
          )}
        </Pressable>
      </Link>
    ),
    headerLeft: () => (
      <TabBarIcon
        name="bars"
        color={Colors[colorScheme ?? "light"].tabIconSelected}
        style={{ marginLeft: 15 }}
        size={22}
        onPress={() => drawerRef.current.openDrawer()}
      />
    ),
  });

  const toggleTheme = () => {};

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerWidth={300}
      drawerPosition="left"
      renderNavigationView={() => (
        <NavigationView
          drawer={drawerRef}
          navigation={navigation}
          toggleTheme={toggleTheme}
        />
      )}
    >
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          // Disable the static render of the header on web
          // to prevent a hydration error in React Navigation v6.
          headerShown: useClientOnlyValue(false, true),
        }}
      >
        <Tabs.Screen
          name="index"
          options={generateTabScreenOptions("Dashboard", "dashboard")}
        />
        <Tabs.Screen
          name="calculator"
          options={generateTabScreenOptions("Calculator", "calculator")}
        />
        <Tabs.Screen
          name="contactUs"
          options={generateTabScreenOptions("ContactUs", "code")}
        />
        <Tabs.Screen
          name="contacts"
          options={generateTabScreenOptions("Contacts", "phone")}
        />
      </Tabs>
    </DrawerLayoutAndroid>
  );
}
