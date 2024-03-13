import { useContext, useEffect } from "react";
import { Text, View } from "../../components/Themed";
import { stateContext } from "@/src/constants/stateContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AdminView, Login } from "../../components";

export default function QuizScreen() {
  const { db, user, setUser } = useContext(stateContext);

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
      // setUser(inUser);
      console.log(inUser);
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

  return (
    <View>
      {user?.role === "admin" ? (
        <AdminView />
      ) : user?.role === "user" ? (
        <View>
          <Text>User view</Text>
        </View>
      ) : (
        <Login />
      )}
    </View>
  );
}
