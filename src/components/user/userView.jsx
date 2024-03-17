import { useContext, useEffect, useState } from "react";
import { View } from "../Themed";
import { MonoText } from "@/src/components/StyledText";
import { stateContext } from "@/src/constants/stateContext";
import { StyleSheet } from "react-native";
import { Button, SegmentedButtons, Icon } from "react-native-paper";
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

export default function UserView() {
  const { user } = useContext(stateContext);
  const [value, setValue] = useState("quizes");
  const [quizes, setQuizes] = useState([]);

  function getQuizes() {
    db.transaction((tx) => {
      tx.executeSql("select * from quizes", [], (_, { rows }) => {
        setQuizes(rows._array);
      });
    });
  }

  useEffect(() => {
    getQuizes();
  }, []);

  return (
    <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
      <View style={styles.title}>
        <MonoText>Welcome {user.email}</MonoText>
      </View>

      <View style={styles.tabs}>
        <MonoText>Here are the quizes to attempt</MonoText>
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          buttons={[
            {
              value: "quizes",
              label: "Available quizes",
              icon: "book",
            },
            {
              value: "marks",
              label: "Your marks",
              icon: "check-circle",
            },
          ]}
        />
      </View>

      {value === "quizes" ? (
        <View style={styles.quizList}>
          <MonoText style={{marginBottom: 10}}>Quizes to attempt</MonoText>
          {quizes.map((item) => (
            <View key={item.id} style={styles.quiz}>
              <View style={styles.quizName}>
                <Icon source="notebook" size={20} />
                <MonoText>{item.quizName}</MonoText>
              </View>
              <Button>Attempt quiz</Button>
            </View>
          ))}

          {quizes.length === 0 && (
            <View style={styles.lostQuizes}>
              <Icon source="notebook" color={"white"} size={20} />
              <MonoText>No quizes available</MonoText>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  tabs: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    gap: 10,
    paddingVertical: 10,
  },
  quizList: {
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: 10,
    gap: 5,
    paddingVertical: 10,
  },
  quiz: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "darkslategray",
    borderRadius: 6,
  },
  quizName: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "transparent",
  },
  lostQuizes: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 10,
    marginTop: 60,
  },
});
