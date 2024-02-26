import {
  StyleSheet,
  Image,
  TouchableOpacity,
  useColorScheme,
  Modal,
} from "react-native";
import { View } from "@/src/components/Themed";
import { MonoText } from "@/src/components/StyledText";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/src/constants/Colors";
import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import icon from "@/assets/images/icon.png";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const colorScheme = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState();
  const [userInfo, setUserInfo] = useState();

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

  // ios clientID:: 621649646934-mearbq8i8jh7s4ir31uil20m7lg5l7ag.apps.googleusercontent.com
  // android clientID: 621649646934-m3pd1oo9jtfj0b0tk69f7cj7hiu6d6vc.apps.googleusercontent.com

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "621649646934-m3pd1oo9jtfj0b0tk69f7cj7hiu6d6vc.apps.googleusercontent.com",
    iosClientId:
      "621649646934-mearbq8i8jh7s4ir31uil20m7lg5l7ag.apps.googleusercontent.com",
  });

  const handleSigninWithGoogle = async () => {
    const user = await AsyncStorage.getItem("@user");
    if (!user) {
      if (response?.type === "success") {
        await getUserInfo(response.authentication.accessToken);
      }
    } else {
      setUserInfo(JSON.parse(user));
    }
  };

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      await AsyncStorage, setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {}
  };

  useEffect(() => {
    handleSigninWithGoogle();
  }, [response]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.imageView}>
          <MonoText style={{ fontSize: 20 }}>Your Profile</MonoText>
          <TouchableOpacity style={styles.imageBox}>
            <Image
              source={image ? { uri: image } : icon}
              style={[styles.image]}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.imagePicker}
            >
              <FontAwesome
                name="camera"
                size={20}
                style={{ color: Colors[colorScheme ?? "light"].text }}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        <View style={styles.accountInfo}>
          <MonoText style={{ fontSize: 20 }}>
            {userInfo?.name || "Neo Joram"}
          </MonoText>
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => promptAsync()}
          >
            <MonoText>Signin with Google</MonoText>
          </TouchableOpacity>
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
  },
  imageView: {
    width: "100%",
    padding: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 10,
  },
  imageBox: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "whitesmoke",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  imagePicker: {
    position: "absolute",
    bottom: 0,
    right: 3,
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 100,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },

  blurContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },

  profileActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    gap: 30,
  },

  accountInfo: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  authButton: {
    padding: 10,
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 10,
  },
});
