import axios from "axios";

export async function synchronizeQuizes(db) {
  console.log("Quiz syncing");
  const sqliteData = await querySQLiteData(db);
  const postgresData = await queryPostgreSQLData(db);

  for (const postData of postgresData) {
    const matchingData = sqliteData.find(
      (sqliteRow) => sqliteRow.id === postData.id
    );

    if (!matchingData) {
      await insertDataToSQLite(postData, db);
    }
  }
}

async function querySQLiteData(db) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM quizes",
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

async function queryPostgreSQLData() {
  try {
    let reqOptions = {
      url: "https://mobile.express.rw/quiz/retrieve",
      method: "GET",
    };
    const response = await axios.request(reqOptions);
    return response.data;
  } catch (error) {
    console.error("Error querying data from PostgreSQL:", error);
    throw error;
  }
}

async function insertDataToSQLite(data, db) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO quizes (id, quizName, dateTime) VALUES (?, ?, ?)",
        [data.id, data.quizName, data.dateTime],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            resolve();
          } else {
            reject(new Error("Failed to insert quizes into SQLite database."));
          }
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}
