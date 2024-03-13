import React, { createContext, useState } from "react";
import PropTypes from "prop-types";
import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";

export const stateContext = createContext();

export const StateProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 1,
    email: "neojoram12@gmail.com",
    password: "neojoram",
    role: "admin",
  });
  const [loading, setLoading] = useState(false);

  function openDatabase() {
    if (Platform.OS === "web") {
      return {
        transaction: () => {
          return {
            executeSql: () => {},
          };
        },
      };
    }

    const db = SQLite.openDatabase("mobiledb.db");
    return db;
  }
  const db = openDatabase();
  
  const stateValues = {
    user,
    setUser,
    loading,
    setLoading,
    db,
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
