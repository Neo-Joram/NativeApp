import React, { useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Modal, Portal } from "react-native-paper";
import { MonoText } from "@/src/components/StyledText";
import { View } from "../Themed";
import { RadioButton } from "react-native-paper";
import { stateContext } from "@/src/constants/stateContext";

export default function Attempt({
  db,
  visible,
  hideModal,
  quizId,
  questions,
  answers,
  attempts,
  getAttempts,
}) {
  const { user, setLoading } = useContext(stateContext);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [checked, setChecked] = useState();
  const [quizRes, setQuizRes] = useState([]);
  const currentQuestions = questions.filter(
    (element) => element?.quizId === quizId
  );

  function handlePrevQuestion() {
    setQuestionIndex((index) => (index -= 1));
  }

  const questionAnswers = answers.filter(
    (element) => element.questionId === currentQuestions[questionIndex]?.id
  );

  async function handleCheckAnswer() {
    const answer = await answers.filter((element) => element.id === checked);
    setQuizRes((prevQuizRes) => {
      return [...prevQuizRes, { correct: answer[0]?.isCorrect }];
    });
    setQuestionIndex((index) => (index += 1));
  }

  const calculateTotalScore = () => {
    const correctAnswersCount = quizRes.filter(
      (answer) => answer.correct === "true"
    ).length;
    const totalQuestions = questions.length;
    const score = (correctAnswersCount / totalQuestions) * 100;
    return score;
  };

  function handleFinish() {
    const marks = calculateTotalScore();

    setLoading(true);
    db.transaction((tx) => {
      tx.executeSql(
        "insert into attempts(userId, quizId, marks) values (?, ?, ?)",
        [user?.id, quizId, marks],
        (_, { rowsAffected }) => {
          setLoading(false);
          hideModal();
          if (rowsAffected > 0) {
            getAttempts();
          } else {
            console.log("No rows affected.");
          }
        }
      );
    });
  }

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.modal}
      >
        <MonoText style={{ paddingBottom: 15 }}>
          Quiz attempt{" "}
          {" (" + attempts?.length + ") " + attempts[0]?.marks + "%"}
        </MonoText>
        <View style={{ backgroundColor: "transparent" }}>
          <MonoText>
            {currentQuestions[questionIndex] === undefined ? (
              <MonoText>You are about to finish your quiz</MonoText>
            ) : (
              questionIndex +
              1 +
              ". " +
              currentQuestions[questionIndex]?.question
            )}
          </MonoText>
          <RadioButton.Group
            onValueChange={(newValue) => setChecked(newValue)}
            value={checked}
          >
            {questionAnswers.map((ans, index) => (
              <View key={index} style={styles.answer}>
                <RadioButton value={ans.id} />
                <MonoText>{ans.answer}</MonoText>
              </View>
            ))}
          </RadioButton.Group>
        </View>
        {currentQuestions[questionIndex] === undefined ? (
          <Button mode="contained" style={styles.button} onPress={handleFinish}>
            Finish
          </Button>
        ) : (
          <View style={styles.buttons}>
            <Button
              mode="contained"
              style={[
                styles.button,
                { display: questionIndex === 0 ? "none" : "", width: "48%" },
              ]}
              onPress={handlePrevQuestion}
            >
              Prev
            </Button>
            <Button
              mode="contained"
              style={[
                styles.button,
                {
                  width: questionIndex === 0 ? "100%" : "48%",
                },
              ]}
              onPress={handleCheckAnswer}
            >
              Submit
            </Button>
          </View>
        )}
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "darkslategray",
    marginHorizontal: 30,
    padding: 20,
    borderRadius: 12,
  },
  answer: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    backgroundColor: "transparent",
    marginVertical: 1,
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  button: {
    marginTop: 10,
  },
});
