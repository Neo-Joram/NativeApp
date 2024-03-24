import axios from "axios";

export async function synchronizeQuizes(db) {
  const sqliteData = await querySQLiteData(db);
  const postgresData = await queryPostgreSQLData();

  sqliteData.map((sqliteRow) => {
    const matchingData = postgresData.quizzes.find(
      (postData) => postData.id === sqliteRow.id
    );

    if (!matchingData) {
      insertDataToPostgreSQL(sqliteRow);
    }
  });
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
    const response = await axios.get(
      "https://midapp.onrender.com/quiz/retrieve"
    );
    return response.data;
  } catch (error) {
    console.error("Error querying data from PostgreSQL:", error);
    throw error;
  }
}

async function insertDataToPostgreSQL(data) {
  try {
    const response = await axios.post(
      "https://midapp.onrender.com/quiz/add",
      {data}
    );
    console.log("Data inserted into PostgreSQL:", response.data);
  } catch (error) {
    console.error("Error inserting data into PostgreSQL:", error);
    throw error;
  }
}
