import axios from "axios";

export async function synchronizeAnswers(db) {
  const sqliteData = await querySQLiteAnswers(db);
  const postgresData = await queryPostgreSQLAnswers(db);

  for (const postData of postgresData) {
    const matchingData = sqliteData.find(
      (sqliteRow) => sqliteRow.id === postData.id
    );

    if (!matchingData) {
      await insertAnswerToSQLite(postData);
    }
  }
}

async function querySQLiteAnswers(db) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM answers",
        [],
        (_, { rows }) => {
          const data = rows._array;
          resolve(data);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}

async function queryPostgreSQLAnswers() {
  try {
    let reqOptions = {
      url: "https://mobile.express.rw/answers/retrieve",
      method: "GET",
    };
    const response = await axios.request(reqOptions);
    return response.data;
  } catch (error) {
    console.error("Error querying data from PostgreSQL:", error);
    throw error;
  }
}

async function insertAnswerToSQLite(data, db) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO answers (id, questionId, answer, isCorrect) VALUES (?, ?, ?, ?)",
        [data.id, data.questionId, data.answer, data.isCorrect],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            resolve();
          } else {
            reject(new Error("Failed to insert answer into SQLite database."));
          }
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}
