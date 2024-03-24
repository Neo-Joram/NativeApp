import axios from "axios";

export async function synchronizeQuestions(db) {
  const sqliteData = await querySQLiteQuestions(db);
  const postgresData = await queryPostgreSQLQuestions(db);

  for (const postData of postgresData) {
    const matchingData = sqliteData.find(
      (sqliteRow) => sqliteRow.id === postData.id
    );

    if (!matchingData) {
      await insertQuestionToSQLite(postData, db);
    }
  }
}

async function querySQLiteQuestions(db) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM questions",
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

async function queryPostgreSQLQuestions() {
  try {
    let reqOptions = {
      url: "https://mobile.express.rw/questions/retrieve",
      method: "GET",
    };
    const response = await axios.request(reqOptions);
    return response.data;
  } catch (error) {
    console.error("Error querying data from PostgreSQL:", error);
    throw error;
  }
}

async function insertQuestionToSQLite(data, db) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO questions (id, quizId, question) VALUES (?, ?, ?)",
        [data.id, data.quizId, data.question],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            resolve();
          } else {
            reject(
              new Error("Failed to insert question into SQLite database.")
            );
          }
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}
