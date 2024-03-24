import { useContext, useEffect, useState } from "react";
import { View } from "../Themed";
import { MonoText } from "@/src/components/StyledText";
import { stateContext } from "@/src/constants/stateContext";
import { StyleSheet } from "react-native";
import { Button, SegmentedButtons, Icon } from "react-native-paper";
import Attempt from "./attempt";

export default function UserView({ db }) {
  const { user } = useContext(stateContext);
  const [value, setValue] = useState("quizes");
  const [quizes, setQuizes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [visible, setVisible] = useState(false);
  const [quizId, setQuizId] = useState();

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

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

  function getAttempts() {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from attempts where userId=? order by id desc",
        [user?.id],
        (_, { rows }) => {
          setAttempts(rows._array);
        }
      );
    });
  }

  useEffect(() => {
    getQuizes();
    getQuestions();
    getAnswers();
    getAttempts();
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
          <MonoText style={{ marginBottom: 10 }}>Quizes to attempt</MonoText>
          {quizes.map((item) => (
            <View key={item.id} style={styles.quiz}>
              <View style={styles.quizName}>
                <Icon source="notebook" size={20} />
                <MonoText>
                  {item.quizName + " (" + attempts.length + ")"}
                </MonoText>
              </View>
              <Button
                onPress={() => {
                  showModal();
                  setQuizId(item.id);
                }}
              >
                Attempt quiz
              </Button>
            </View>
          ))}

          {quizes.length === 0 && (
            <View style={styles.lostQuizes}>
              <Icon source="notebook" color={"white"} size={20} />
              <MonoText>No quizes available</MonoText>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.quizList}>
          <MonoText style={{ marginBottom: 10 }}>
            Latest marks you acquired
          </MonoText>
          {quizes.map((item) => (
            <View key={item.id} style={styles.quiz}>
              <View style={styles.quizName}>
                <Icon source="check" size={20} />
                <MonoText>
                  {item.quizName + " (*" + attempts.length + ")"}
                </MonoText>
              </View>
              <Button mode="elevated">
                {attempts.find((element) => element?.quizId === item.id)?.marks +
                  "%"}
              </Button>
            </View>
          ))}

          {quizes.length === 0 && (
            <View style={styles.lostQuizes}>
              <Icon source="notebook" color={"white"} size={20} />
              <MonoText>No attempts available</MonoText>
            </View>
          )}
        </View>
      )}

      <Attempt
        db={db}
        visible={visible}
        hideModal={hideModal}
        quizId={quizId}
        quizes={quizes}
        questions={questions}
        answers={answers}
        attempts={attempts}
        getAttempts={getAttempts}
      />
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
