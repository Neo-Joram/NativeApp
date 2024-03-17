import React, { createContext, useState } from "react";
import PropTypes from "prop-types";

export const stateContext = createContext();

export const StateProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  // const [user, setUser] = useState({
  //   id: 1,
  //   email: "neojoram12@gmail.com",
  //   password: "neojoram",
  //   role: "user",
  // });

  const stateValues = {
    user,
    setUser,
    loading,
    setLoading,
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
