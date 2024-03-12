import { Platform, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Text, View } from "../../components/Themed";
import { Icon } from "react-native-paper";
import { MonoText } from "@/src/components/StyledText";
import { TextInput, Button } from "react-native-paper";

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

export default function QuizScreen() {
  const [login, setLogin] = useState(true);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        // "drop table users", 
        "create table if not exists users (id integer primary key not null, email string, password string, role string)"
      );
    });
  }, []);

  function createUser() {
    console.log("Pressed");
    db.transaction((tx) => {
      tx.executeSql(
        "insert into users(email, password, role) values (?, ?, ?)",
        ["neojoram12@dev.com", "neojoram", 'admin'],
        // "update users set role=? where id=1", ['admin'],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            // User inserted successfully, now fetch all users
            tx.executeSql("select * from users", [], (_, { rows }) =>
              console.log(JSON.stringify(rows))
            );
          } else {
            console.log("No rows affected.");
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
        <Text>Please login to your account</Text>
      </View>

      <View style={styles.loginForm}>
        <TextInput label={"Email"} mode="outlined" placeholder="Email..." />
        <TextInput
          label={"Password"}
          mode="outlined"
          placeholder="Password..."
          secureTextEntry
          right={<TextInput.Icon icon="eye" />}
        />
        <Button mode="contained" onPress={createUser}>
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
