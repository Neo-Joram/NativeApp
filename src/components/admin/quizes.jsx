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

export default function QuizesPart({ quizes, getQuizes }) {
  const { loading, setLoading } = useContext(stateContext);
  const [visible, setVisible] = useState(false);
  const [quizName, setQuizName] = useState("");
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([12, 15, 20]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, quizes.length);
  const [updateData, setUpdateData] = useState({});

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  function handleUpdateData(id, qn, todo) {
    setUpdateData({ id, quizName: qn, action: todo });
    showModal();
  }

  async function quizAction() {
    if (updateData?.action === "delete") {
      setLoading(true);
      db.transaction((tx) => {
        tx.executeSql(
          "delete from quizes where id=?",
          [updateData.id],
          (_, { rowsAffected }) => {
            setLoading(false);
            hideModal();
            if (rowsAffected > 0) {
              getQuizes();
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
          "update quizes set quizName=? where id=?",
          [quizName, updateData?.id],
          (_, { rowsAffected }) => {
            setLoading(false);
            hideModal();
            if (rowsAffected > 0) {
              getQuizes();
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
          "insert into quizes(quizName, dateTime) values (?, ?)",
          [quizName, new Date().toLocaleDateString()],
          (_, { rowsAffected }) => {
            setLoading(false);
            hideModal();
            if (rowsAffected > 0) {
              getQuizes();
            } else {
              console.log("No rows affected.");
            }
          }
        );
      });
    }
  }

  return (
    <View>
      <View style={styles.thead}>
        <MonoText>Manage the quizes</MonoText>
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
          <DataTable.Title>QuizName</DataTable.Title>
          <DataTable.Title numeric>Date</DataTable.Title>
          <DataTable.Title numeric>Do</DataTable.Title>
        </DataTable.Header>

        {quizes.slice(from, to).map((item, index) => (
          <DataTable.Row key={index}>
            <DataTable.Cell>{index+1}</DataTable.Cell>
            <DataTable.Cell>{item.quizName}</DataTable.Cell>
            <DataTable.Cell numeric>{item.dateTime}</DataTable.Cell>
            <DataTable.Cell numeric>
              <IconButton
                icon={"pen"}
                size={13}
                mode="contained"
                onPress={() =>
                  handleUpdateData(item.id, item.quizName, "update")
                }
              />{" "}
              <IconButton
                icon={"basket"}
                size={13}
                mode="contained"
                onPress={() =>
                  handleUpdateData(item.id, item.quizName, "delete")
                }
              />
            </DataTable.Cell>
          </DataTable.Row>
        ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(quizes.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} of ${quizes.length}`}
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
            <MonoText style={{ paddingBottom: 15 }}>Update a quiz</MonoText>
          ) : updateData?.action === "delete" ? (
            <MonoText style={{ paddingBottom: 15 }}>Delete a quiz</MonoText>
          ) : (
            <MonoText style={{ paddingBottom: 15 }}>Add new quiz</MonoText>
          )}

          <View style={{ backgroundColor: "transparent" }}>
            <TextInput
              label={"Quiz name"}
              mode="outlined"
              defaultValue={updateData?.quizName}
              placeholder="Quiz name..."
              onChangeText={(text) => setQuizName(text)}
            />
            <Button
              mode="contained"
              loading={loading}
              style={{ marginTop: 15 }}
              onPress={quizAction}
            >
              {updateData?.action === "update"
                ? "Update quiz"
                : updateData?.action === "delete"
                ? "Delete quiz"
                : "Add quiz"}
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
