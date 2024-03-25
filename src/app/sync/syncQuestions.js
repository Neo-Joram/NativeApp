import axios from "axios";

export async function synchronizeQuestions(db) {
  const sqliteData = await querySQLiteData(db);
  const postgresData = await queryPostgreSQLData();

  sqliteData.forEach((sqliteRow) => {
    const correspondingRow = postgresData.quizzes.find(
      (element) => element.id === sqliteRow.id
    );
    if (correspondingRow) {
      if (!isEqual(correspondingRow, sqliteRow)) {
        updateDataInPostgreSQL(sqliteRow);
      }
    } else {
      insertDataToPostgreSQL(sqliteRow);
    }
  });

  postgresData.quizzes.forEach((postgresRow) => {
    const correspondingRow = sqliteData.find(
      (element) => element.id === postgresRow.id
    );
    if (!correspondingRow) {
      deleteDataFromPostgreSQL(postgresRow);
    }
  });
}

async function querySQLiteData(db) {
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

async function queryPostgreSQLData() {
  try {
    let reqOptions = {
      url: "https://midapp.onrender.com/questions/retrieve",
      method: "GET",
    };
    const response = await axios.request(reqOptions);
    return response.data;
  } catch (error) {
    console.error("Error querying data from PostgreSQL:", error);
    throw error;
  }
}

async function insertDataToPostgreSQL(data) {
  try {
    let config = {
      method: "POST",
      url: "https://midapp.onrender.com/questions/add",
      data: data,
    };
    const response = await axios.request(config);
    console.log("Data inserted into PostgreSQL:", response.data);
  } catch (error) {
    console.error("Error inserting data into PostgreSQL:", error);
    throw error;
  }
}

async function updateDataInPostgreSQL(data) {
  try {
    let config = {
      method: "POST",
      url: "https://midapp.onrender.com/questions/update",
      data: data,
    };
    const response = await axios.request(config);
    console.log("Data updated in PostgreSQL:", response.data);
  } catch (error) {
    console.error("Error inserting data into PostgreSQL:", error);
    throw error;
  }
}

async function deleteDataFromPostgreSQL(data) {
  try {
    let config = {
      method: "POST",
      url: "https://midapp.onrender.com/questions/delete",
      data: data,
    };
    const response = await axios.request(config);
    console.log("Data deleted from PostgreSQL:", response.data);
  } catch (error) {
    console.error("Error inserting data into PostgreSQL:", error);
    throw error;
  }
}
