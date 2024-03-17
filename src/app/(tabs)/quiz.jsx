import { useContext, useEffect } from "react";
import { View } from "../../components/Themed";
import { stateContext } from "@/src/constants/stateContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AdminView, Login, UserView } from "../../components";
import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";
import { IconButton } from "react-native-paper";
import { useNavigation } from "expo-router";

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
  const { user, setUser } = useContext(stateContext);
  const navigation = useNavigation();

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists users (id integer primary key not null, email string, password string, role string)"
      );
      tx.executeSql(
        "create table if not exists quizes (id integer primary key not null, quizName string, dateTime date)"
      );
      tx.executeSql(
        "create table if not exists questions (id integer primary key not null, quizId integer, question string, foreign key (quizId) references quizes(id))"
      );
      tx.executeSql(
        "create table if not exists answers (id integer primary key not null, questionId integer, answer string, isCorrect integer, foreign key (questionId) references questions(id))"
      );
    });
  }, []);

  useEffect(() => {
    async function getUserInfo() {
      const inUser = await AsyncStorage.getItem("userSession");
      setUser(JSON.parse(inUser));
    }
    getUserInfo();

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';",
        [],
        (_, { rows }) => {
          console.log(rows._array);
        },
        (_, error) => {
          console.log("Error checking tables:", error);
        }
      );
    });
  }, []);

  async function logout() {
    try {
      await AsyncStorage.removeItem("userSession");
      setUser({});
    } catch (error) {
      console.log("Error removing user session:", error);
    }
    navigation.goBack();
  }

  return (
    <View style={{ height: "100%" }}>
      {user?.role === "admin" ? (
        <AdminView />
      ) : user?.role === "user" ? (
        <UserView />
      ) : (
        <Login />
      )}

      {user && (
        <IconButton
          icon="logout"
          size={25}
          mode="contained-tonal"
          onPress={logout}
          style={{ position: "absolute", bottom: 15, right: 15 }}
        />
      )}
    </View>
  );
}
