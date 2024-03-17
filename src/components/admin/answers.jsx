import { View } from "@/src/components/Themed";
import { MonoText } from "@/src/components/StyledText";
import {
  Button,
  IconButton,
  Modal,
  Portal,
  TextInput,
} from "react-native-paper";
import { useContext, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { DataTable } from "react-native-paper";
import { stateContext } from "@/src/constants/stateContext";
import { Picker } from "@react-native-picker/picker";

export default function AnswersPart({ db, questions, answers, getAnswers }) {
  const { loading, setLoading } = useContext(stateContext);
  const [visible, setVisible] = useState(false);
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([5, 8, 10]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, answers.length);
  const [updateData, setUpdateData] = useState({});

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  function handleUpdateData(id, qn, isc, todo) {
    setUpdateData({ id, answer: qn, isCorrect: isc, action: todo });
    showModal();
  }

  async function answersAction() {
    if (updateData?.action === "delete") {
      setLoading(true);
      db.transaction((tx) => {
        tx.executeSql(
          "delete from answers where id=?",
          [updateData?.id],
          (_, { rowsAffected }) => {
            setLoading(false);
            hideModal();
            if (rowsAffected > 0) {
              getAnswers();
            } else {
              console.log("No rows affected.");
            }
          }
        );
      });
    } else if (updateData?.action === "update") {
      setLoading(true);
      db.transaction((tx) => {
        tx.executeSql(
          "update answers set answer=?, isCorrect=? where id=?",
          [answer, isCorrect, updateData?.id],
          (_, { rowsAffected }) => {
            setLoading(false);
            hideModal();
            if (rowsAffected > 0) {
              getAnswers();
            } else {
              console.log("No rows affected.");
            }
          }
        );
      });
    } else {
      setLoading(true);
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM questions WHERE id=?",
          [selectedValue],
          (_, { rows }) => {
            setLoading(false);
            hideModal();
            if (rows.length === 0) {
              console.log("Question not found");
            } else {
              tx.executeSql(
                "INSERT INTO answers (questionId, answer, isCorrect) VALUES (?, ?, ?)",
                [selectedValue, answer, isCorrect],
                (_, { rowsAffected }) => {
                  if (rowsAffected > 0) {
                    getAnswers();
                  } else {
                    console.log("No rows affected.");
                  }
                },
                (_, error) => {
                  console.log("Error inserting answer:", error);
                }
              );
            }
          },
          (_, error) => {
            console.log("Error selecting question:", error);
          }
        );
      });
    }
  }

  return (
    <View>
      <View style={styles.thead}>
        <MonoText>Manage the answers</MonoText>
        <Button
          mode="contained"
          icon={"plus"}
          onPress={() => {
            setUpdateData({ action: "add" });
            showModal();
          }}
        >
          New
        </Button>
      </View>

      <DataTable>
        <DataTable.Header>
          <DataTable.Title>#</DataTable.Title>
          <DataTable.Title>Question Id</DataTable.Title>
          <DataTable.Title>Answer</DataTable.Title>
          <DataTable.Title numeric>isCorrect</DataTable.Title>
          <DataTable.Title numeric>Do</DataTable.Title>
        </DataTable.Header>

        {answers.slice(from, to).map((item) => (
          <DataTable.Row key={item.id}>
            <DataTable.Cell>{item.id}</DataTable.Cell>
            <DataTable.Cell>{item.questionId}</DataTable.Cell>
            <DataTable.Cell>{item.answer}</DataTable.Cell>
            <DataTable.Cell numeric>{item.isCorrect}</DataTable.Cell>
            <DataTable.Cell numeric>
              <IconButton
                icon={"pen"}
                size={13}
                mode="contained"
                onPress={() =>
                  handleUpdateData(
                    item.id,
                    item.answer,
                    item.isCorrect,
                    "update"
                  )
                }
              />{" "}
              <IconButton
                icon={"basket"}
                size={13}
                mode="contained"
                onPress={() =>
                  handleUpdateData(
                    item.id,
                    item.answer,
                    item.isCorrect,
                    "delete"
                  )
                }
              />
            </DataTable.Cell>
          </DataTable.Row>
        ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(answers.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} of ${answers.length}`}
          numberOfItemsPerPageList={numberOfItemsPerPageList}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          showFastPaginationControls
          selectPageDropdownLabel={"Rows"}
        />
      </DataTable>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalStyles}
        >
          {updateData?.action === "update" ? (
            <MonoText style={{ paddingBottom: 15 }}>Update an answer</MonoText>
          ) : updateData?.action === "delete" ? (
            <MonoText style={{ paddingBottom: 15 }}>Delete an answer</MonoText>
          ) : (
            <MonoText style={{ paddingBottom: 15 }}>Add newn answer</MonoText>
          )}

          <View style={{ backgroundColor: "transparent" }}>
            <Picker
              selectedValue={selectedValue}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedValue(itemValue)
              }
              style={styles.picker}
            >
              {questions.map((item, index) => (
                <Picker.Item
                  key={index}
                  label={index + 1 + " " + item.question}
                  value={item.id}
                />
              ))}
            </Picker>
            <TextInput
              label={"Answer"}
              mode="outlined"
              defaultValue={updateData?.answer}
              placeholder="Answer..."
              onChangeText={(text) => setAnswer(text)}
            />
            <Picker
              selectedValue={isCorrect}
              onValueChange={(itemValue, itemIndex) => setIsCorrect(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="True" value={true} />
              <Picker.Item label="False" value={false} />
            </Picker>
            <Button
              mode="contained"
              loading={loading}
              style={{ marginTop: 15 }}
              onPress={answersAction}
            >
              {updateData?.action === "update"
                ? "Update answer"
                : updateData?.action === "delete"
                ? "Delete answer"
                : "Add answer"}
            </Button>
          </View>
        </Modal>
      </Portal>
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
  thead: {
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalStyles: {
    backgroundColor: "darkslategray",
    marginHorizontal: 30,
    padding: 20,
    borderRadius: 12,
  },
});
