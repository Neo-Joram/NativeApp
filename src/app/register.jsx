import { Platform, StyleSheet } from "react-native";
import { useContext, useState } from "react";
import { Text, View } from "../components/Themed";
import { Icon } from "react-native-paper";
import { MonoText } from "@/src/components/StyledText";
import { TextInput, Button } from "react-native-paper";
import { stateContext } from "@/src/constants/stateContext";

import { Link, useNavigation } from "expo-router";
import * as SQLite from "expo-sqlite";

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

export default function Register() {
  const { loading, setLoading } = useContext(stateContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pwd, setPwd] = useState(true);
  const navigation = useNavigation();

  function createUser() {
    setLoading(true);
    db.transaction((tx) => {
      tx.executeSql(
        "select * from users where email=?",
        [email],
        (_, { rows }) => {
          if (rows.length > 0) {
            console.log("User already registered");
            setLoading(false); // Make sure to set loading to false
          } else {
            tx.executeSql(
              "insert into users(email, password, role) values (?, ?, ?)",
              [email, password, "user"],
              (_, { rowsAffected }) => {
                setLoading(false);
                if (rowsAffected > 0) {
                  navigation.goBack();
                  tx.executeSql("select * from users", [], (_, { rows }) =>
                    console.log(JSON.stringify(rows))
                  );
                } else {
                  console.log("No rows affected.");
                }
              }
            );
          }
        }
      );
    });
  }

  function togglePassword() {
    setPwd((p) => !p);
  }

  return (
    <View>
      <View style={[styles.title, { paddingVertical: 20 }]}>
        <Icon source="account-group-outline" color={"white"} size={200} />
      </View>

      <View style={styles.title}>
        <MonoText style={{ fontSize: 50 }}>Signup</MonoText>
        <View style={{ display: "flex", gap: 5 }}>
          <Text>Create new account or </Text>
          <Link href={"/quiz"} asChild>
            Signin
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
        <Button mode="contained" loading={loading} onPress={createUser}>
          Signup
        </Button>
      </View>

      <View style={[styles.title, { gap: 20 }]}>
        <MonoText style={{}}>Or signup with Google</MonoText>
        <Link href={"/quiz"} style={{}}>
          If not new, Signin
        </Link>
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
