import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { MonoText } from "./StyledText";
import { View } from "./Themed";
import * as Network from "expo-network";
import * as Battery from "expo-battery";

export default function NetWorkInfo() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionType, setConnectionType] = useState();
  const [ipAddress, setIpAddress] = useState();

  const [batteryLevel, setBatteryLevel] = useState(null);
  const [batteryState, setBatteryState] = useState(null);
  const [lowPowerMode, setLowPowerMode] = useState(null);

  useEffect(() => {
    const fetchNetworkInfo = async () => {
      const networkState = await Network.getNetworkStateAsync();
      setIsConnected(networkState.isConnected);

      const connectionInfo = await Network.getNetworkStateAsync();
      setConnectionType(connectionInfo.type);

      const ip = await Network.getIpAddressAsync();
      setIpAddress(ip);
    };

    fetchNetworkInfo();
    const intervalId = setInterval(fetchNetworkInfo, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchBatteryInfo = async () => {
      // Get the current battery level
      const batteryInfo = await Battery.getBatteryLevelAsync();
      setBatteryLevel(batteryInfo);

      // Get the current battery state
      const batteryStateInfo = await Battery.getBatteryStateAsync();
      setBatteryState(batteryStateInfo);

      const lowPowerModeInfo = await Battery.getPowerStateAsync();
      setLowPowerMode(lowPowerModeInfo.lowPowerMode);
    };

    fetchBatteryInfo();
    const intervalId = setInterval(fetchBatteryInfo, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <MonoText style={{ fontSize: 20, paddingBottom: 10 }}>
          Network Info
        </MonoText>
        <View style={styles.networkInfo}>
          <MonoText>
            {isConnected ? "Your are connected" : "No internet connection"}
          </MonoText>
          <MonoText>
            {isConnected && "Connected to " + connectionType + " network"}
          </MonoText>
          <MonoText>{isConnected && "IP address " + ipAddress}</MonoText>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <MonoText style={{ fontSize: 20, paddingBottom: 10 }}>
          Battery Info
        </MonoText>
        <View style={styles.networkInfo}>
          <MonoText>
            Battery Level:{" "}
            {batteryLevel != null
              ? `${(batteryLevel * 100).toFixed(0)}%`
              : "Unknown"}
          </MonoText>
          <MonoText>Battery State: {batteryState ?? "Unknown"} </MonoText>
          <MonoText>
            Low Power Mode:
            {lowPowerMode != null
              ? lowPowerMode
                ? "Enabled"
                : "Disabled"
              : "Unknown"}
          </MonoText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  infoContainer: {
    width: "100%",
    padding: 20,
    display: "flex",
    flexDirection: "column",
  },
});
