import React, { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import * as Network from "expo-network";
import * as Notifications from "expo-notifications";

export const stateContext = createContext();

export const StateProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);

  useEffect(() => {
    const fetchNetworkInfo = async () => {
      const networkState = await Network.getNetworkStateAsync();
      setIsConnected(networkState.isConnected);
    };
    fetchNetworkInfo();
    const intervalId = setInterval(fetchNetworkInfo, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    async function notifPermision() {
      await Notifications.requestPermissionsAsync();
      console.log("asked ppermission");
    }
    notifPermision();
  }, []);

  useEffect(() => {
    setSnackVisible(true);
    const timerId = setTimeout(() => {
      setSnackVisible(false);
    }, 5000);

    return () => {
      clearTimeout(timerId);
    };
  }, [isConnected]);

  const stateValues = {
    user,
    setUser,
    loading,
    setLoading,
    isConnected,
    setIsConnected,
    snackVisible,
    setSnackVisible,
  };

  return (
    <stateContext.Provider value={stateValues}>
      {children}
    </stateContext.Provider>
  );
};

StateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
