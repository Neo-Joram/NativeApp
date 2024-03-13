import { Platform, StyleSheet } from "react-native";
import { useContext, useState } from "react";
import { Text, View } from "./Themed";
import { Icon } from "react-native-paper";
import { MonoText } from "@/src/components/StyledText";
import { TextInput, Button } from "react-native-paper";
import { stateContext } from "@/src/constants/stateContext";

import { Link, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const { db, setUser, loading, setLoading } = useContext(stateContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pwd, setPwd] = useState(true);
  const navigation = useNavigation();

  function togglePassword() {
    setPwd((p) => !p);
  }

  function loginUser() {
    setLoading(true);
    db.transaction((tx) => {
      tx.executeSql(
        "select * from users where email=? && password=?",
        [email, password],
        (_, { rows }) => {
          setLoading(false);
          if (rows.length > 0) {
            AsyncStorage.setItem("userSession", JSON.stringify(rows._array[0]))
              .then(() => {
                console.log("User session stored:", rows._array[0]);
                setUser(rows._array[0]);
                navigation.navigate("/quiz");
              })
              .catch((error) => {
                console.log("Error storing user session:", error);
              });
          } else {
            console.log("No user found.");
          }
        }
      );
    });
  }
  return (
    <View>
      <View style={[styles.title, { paddingVertical: 20 }]}>
        <Icon source="account-group-outline" color={"white"} size={200} />
      </View>

      <View style={styles.title}>
        <MonoText style={{ fontSize: 50 }}>Login</MonoText>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            alignItems: "baseline",
          }}
        >
          <Text>Please login to your account or</Text>
          <Link href={"/register"} asChild>
            <Text style={{ fontSize: 20 }}>Signup</Text>
          </Link>
        </View>
      </View>

      <View style={styles.loginForm}>
        <TextInput
          label={"Email"}
          mode="outlined"
          placeholder="Email..."
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          label={"Password"}
          mode="outlined"
          placeholder="Password..."
          secureTextEntry={pwd}
          right={<TextInput.Icon icon="eye" onPress={togglePassword} />}
          onChangeText={(text) => setPassword(text)}
        />
        <Button mode="contained" loading={loading} onPress={loginUser}>
          Login
        </Button>
      </View>

      <View style={[styles.title, { gap: 20 }]}>
        <MonoText style={{}}>Or login with Google</MonoText>
        <MonoText style={{}}>If you are new, Create an account</MonoText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loginForm: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    paddingHorizontal: 40,
    paddingVertical: 30,
  },
});
