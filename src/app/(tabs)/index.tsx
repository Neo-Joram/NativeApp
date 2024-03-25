import { StyleSheet } from "react-native";

import NetworkInfo from "@/src/components/networkInfo";
import { Text, View } from "@/src/components/Themed";
import * as Notifications from "expo-notifications";
import { Button, Snackbar } from "react-native-paper";
import { stateContext } from "@/src/constants/stateContext";
import { useContext, useState } from "react";
import MapView, { Marker } from "react-native-maps";

export default function TabOneScreen() {
  const { snackVisible, isConnected, setSnackVisible } =
    useContext(stateContext);
  const [x, setX] = useState({
    latitude: -1.9517539,
    longitude: 30.1055004,
  });
  const [viewMap, setViewMap] = useState(false);

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

  function openMap() {
    setViewMap((prev) => !prev);
  }

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

      <Button mode="contained" icon="map" onPress={openMap}>
        View my home location!
      </Button>
      {viewMap && (
        <MapView
          initialRegion={{
            latitude: -1.9517539,
            longitude: 30.1055004,
            // latitudeDelta: 0.0922,
            // longitudeDelta: 0.0421,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          mapType="satellite"
          zoomEnabled={true}
          style={styles.map}
        >
          <Marker draggable coordinate={x} />
        </MapView>
      )}

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
  map: {
    marginHorizontal: 10,
    height: 400,
    width: "100%",
    marginTop: 10,
  },
});
