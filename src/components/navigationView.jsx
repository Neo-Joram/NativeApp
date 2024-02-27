import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { View } from "./Themed";
import { useColorScheme } from "@/src/components/useColorScheme";
import { BlurView } from "expo-blur";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons"; // Don't forget to import MaterialCommunityIcons

import Colors from "@/src/constants/Colors";
import { Link } from "expo-router";
import { MonoText } from "./StyledText";
import * as ImagePicker from "expo-image-picker";
import icon from "@/assets/images/icon.png";

export function NavigationView({ navigation, drawer, toggleTheme }) {
  const colorScheme = useColorScheme();
  const [image, setImage] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const uploadImage = async (mode) => {
    try {
      let result = {};

      if (mode === "gallery") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
        if (!result.canceled) {
          // Save image
          await saveImage(result.assets[0].uri);
        }
      } else {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.back,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

        if (!result.canceled) {
          // Save image
          await saveImage(result.assets[0].uri);
        }
      }
    } catch (error) {
      alert("Error uploading image");
      setModalVisible(false);
    }
  };

  const saveImage = async (image) => {
    try {
      setImage(image);
      setModalVisible(false);
    } catch (error) {}
  };

  const removeImage = async () => {
    try {
      await saveImage(null);
    } catch (error) {}
  };

  return (
    <>
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
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{ height: 50, width: 50, borderRadius: 100 }}
            >
              <Image
                source={image ? { uri: image } : icon}
                style={{ height: 50, width: 50, borderRadius: 100 }}
              />
            </TouchableOpacity>
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <BlurView intensity={40} style={styles.blurContainer}>
          <View style={styles.modalView}>
            <MonoText style={{ marginBottom: 20, fontSize: 20 }}>
              Profile Options
            </MonoText>
            <View style={styles.profileActions}>
              <TouchableOpacity onPress={() => uploadImage()}>
                <FontAwesome
                  name="camera"
                  size={40}
                  style={{ color: Colors[colorScheme ?? "light"].text }}
                />
                <MonoText>Camera</MonoText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => uploadImage("gallery")}>
                <FontAwesome
                  name="image"
                  size={40}
                  style={{ color: Colors[colorScheme ?? "light"].text }}
                />
                <MonoText>Gallery</MonoText>
              </TouchableOpacity>
              <TouchableOpacity onPress={removeImage}>
                <FontAwesome
                  name="recycle"
                  size={40}
                  style={{ color: Colors[colorScheme ?? "light"].text }}
                />
                <MonoText>Delete</MonoText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <FontAwesome
                  name="times"
                  size={40}
                  style={{ color: Colors[colorScheme ?? "light"].text }}
                />
                <MonoText>Close</MonoText>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </>
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
