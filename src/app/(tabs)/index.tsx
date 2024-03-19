import { StyleSheet } from "react-native";

import NetworkInfo from "@/src/components/networkInfo";
import { Text, View } from "@/src/components/Themed";
import * as Notifications from "expo-notifications";
import { Button, Snackbar } from "react-native-paper";
import { stateContext } from "@/src/constants/stateContext";
import { useContext } from "react";

export default function TabOneScreen() {
  const { snackVisible, isConnected, setSnackVisible } =
    useContext(stateContext);

  const sendNotification = async () => {
    let token = await Notifications.getExpoPushTokenAsync();

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: token.data,
        title: "Hello!",
        body: "This is a test notification",
      }),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Page</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Button mode="contained" icon="bell" onPress={sendNotification}>
        Notify me
      </Button>
      <NetworkInfo />
      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        action={{
          label: "Hide",
          onPress: () => setSnackVisible(false),
        }}
      >
        {isConnected ? "You are connected" : "lost connection"}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: "80%",
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
