import React from "react";
import { Pressable, StyleSheet, Platform, StatusBar } from "react-native";
import { View } from "./Themed";
import { useColorScheme } from "@/src/components/useColorScheme";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons"; // Don't forget to import MaterialCommunityIcons

import Colors from "@/src/constants/Colors";
import { Link } from "expo-router";
import { MonoText } from "./StyledText";

export function NavigationView({ navigation, drawer, toggleTheme }) {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.logo}>
          <MaterialCommunityIcons
            name="album"
            size={40}
            color={Colors[colorScheme ?? "light"].text}
            onPress={() => navigation.navigate("calculator")}
          />
          <MonoText style={{ fontSize: 26 }}>Neo Mobile</MonoText>
        </View>

        <View style={styles.menu}>
          <Link href="/" asChild onPress={() => drawer.current.closeDrawer()}>
            <Pressable>
              {({ pressed }) => (
                <View style={styles.li}>
                  <FontAwesome
                    name="bars"
                    size={24}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                  <MonoText style={styles.a}>Dashboard</MonoText>
                </View>
              )}
            </Pressable>
          </Link>
          <Link
            href="/calculator"
            asChild
            onPress={() => drawer.current.closeDrawer()}
          >
            <Pressable>
              {({ pressed }) => (
                <View style={styles.li}>
                  <FontAwesome
                    name="calculator"
                    size={24}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                  <MonoText style={styles.a}>Calculator</MonoText>
                </View>
              )}
            </Pressable>
          </Link>
          <Link
            href="/contactUs"
            asChild
            onPress={() => drawer.current.closeDrawer()}
          >
            <Pressable>
              {({ pressed }) => (
                <View style={styles.li}>
                  <FontAwesome
                    name="code"
                    size={24}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                  <MonoText style={styles.a}>Contact us</MonoText>
                </View>
              )}
            </Pressable>
          </Link>
          <Link
            href="/Contacts"
            asChild
            onPress={() => drawer.current.closeDrawer()}
          >
            <Pressable>
              {({ pressed }) => (
                <View style={styles.li}>
                  <FontAwesome
                    name="phone"
                    size={24}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                  <MonoText style={styles.a}>Contacts</MonoText>
                </View>
              )}
            </Pressable>
          </Link>
        </View>
      </View>

      <View style={styles.bottom}>
        <View style={styles.account}>
          <MaterialCommunityIcons
            name="account-circle"
            size={50}
            color={Colors[colorScheme ?? "light"].text}
          />
          <View style={styles.accountText}>
            <MonoText style={styles.accountNames}>John Doe</MonoText>
            <MonoText style={styles.accountRole}>Manager</MonoText>
          </View>
        </View>
        <MaterialCommunityIcons
          name="brightness-4"
          size={30}
          color={Colors[colorScheme ?? "light"].text}
          onPress={toggleTheme}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 50 : 0,
  },
  logo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 20,
  },
  menu: {
    paddingVertical: 30,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  li: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  bottom: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  account: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  accountText: {
    display: "flex",
    flexDirection: "column",
  },
  accountNames: {
    fontSize: 17,
    fontWeight: "600",
  },
});
