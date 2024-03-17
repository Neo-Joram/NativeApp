import { View } from "@/src/components/Themed";
import { MonoText } from "@/src/components/StyledText";
import { Divider, SegmentedButtons } from "react-native-paper";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import QuizesPart from "./quizes";
import QuestionsPart from "./questions";
import AnswersPart from "./answers";

export default function AdminView({ db }) {
  const [value, setValue] = useState("quiz");
  const [quizes, setQuizes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  function getQuizes() {
    db.transaction((tx) => {
      tx.executeSql("select * from quizes", [], (_, { rows }) => {
        setQuizes(rows._array);
      });
    });
  }

  function getQuestions() {
    db.transaction((tx) => {
      tx.executeSql("select * from questions", [], (_, { rows }) => {
        setQuestions(rows._array);
      });
    });
  }

  function getAnswers() {
    db.transaction((tx) => {
      tx.executeSql("select * from answers", [], (_, { rows }) => {
        setAnswers(rows._array);
      });
    });
  }

  useEffect(() => {
    getQuizes();
    getQuestions();
    getAnswers();
  }, []);

  return (
    <View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
      <View style={styles.segmentedButtons}>
        <MonoText>Welcome admin {"->"} Manage</MonoText>

        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          buttons={[
            {
              value: "quiz",
              label: "Quizes",
              icon: "book",
            },
            {
              value: "question",
              label: "Questions",
              icon: "note",
            },
            { value: "answer", label: "Answers", icon: "pen" },
          ]}
        />
      </View>
      <Divider style={{ marginVertical: 10 }} />

      {value === "quiz" ? (
        <QuizesPart db={db} quizes={quizes} getQuizes={getQuizes} />
      ) : value === "question" ? (
        <QuestionsPart
          db={db}
          questions={questions}
          getQuestions={getQuestions}
          quizes={quizes}
        />
      ) : (
        <AnswersPart
          db={db}
          questions={questions}
          getAnswers={getAnswers}
          answers={answers}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  segmentedButtons: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    paddingHorizontal: 10,
    alignItems: "center",
  },
});
