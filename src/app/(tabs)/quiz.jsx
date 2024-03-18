import { useContext, useEffect } from "react";
import { View } from "../../components/Themed";
import { stateContext } from "@/src/constants/stateContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AdminView, Login, UserView } from "../../components";
import { IconButton } from "react-native-paper";
import { useNavigation } from "expo-router";
import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";

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
        "create table if not exists answers (id integer primary key not null, questionId integer, answer string, isCorrect boolean, foreign key (questionId) references questions(id))"
      );
      tx.executeSql(
        "create table if not exists attempts (id integer primary key not null, userId integer, quizId integer, marks integer, foreign key (userId) references users(id), foreign key (quizId) references quizes(id))"
      );
    });
    // db.transaction((tx) => {
    //   tx.executeSql(
    //     "BEGIN TRANSACTION; " +
    //       "DELETE FROM questions; " +
    //       "DELETE FROM quizes; " +
    //       "DELETE FROM sqlite_sequence WHERE name='questions'; " +
    //       "DELETE FROM sqlite_sequence WHERE name='quizes'; " +
    //       "COMMIT;",
    //     [],
    //     () => {
    //       console.log("Tables truncated successfully.");
    //     },
    //     (_, error) => {
    //       console.log("Error truncating tables:", error);
    //     }
    //   );
    // });
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
        <AdminView db={db} />
      ) : user?.role === "user" ? (
        <UserView db={db} />
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
