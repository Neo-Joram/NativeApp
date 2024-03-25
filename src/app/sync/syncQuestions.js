import axios from "axios";

export async function synchronizeQuestions(db) {
  const sqliteData = await querySQLiteData(db);
  const postgresData = await queryPostgreSQLData();

  sqliteData.forEach(async (sqliteRow) => {
    const correspondingRow = postgresData.questions.find(
      (element) => element.id === sqliteRow.id
    );
    if (correspondingRow !== undefined) {
      isEqual(correspondingRow, sqliteRow) === false &&
        await updateDataInPostgreSQL(sqliteRow);
    } else {
      await insertDataToPostgreSQL(sqliteRow);
    }
  });

  postgresData.questions.forEach((postgresRow) => {
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
    console.error("Error updating question in PostgreSQL:", error);
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
    console.error("Error deleting question from PostgreSQL:", error);
  }
}

function toLowerKeys(obj) {
  const newObj = {};
  const keys = Object.keys(obj);
  for (const key of keys) {
    newObj[key.toLowerCase()] = obj[key];
  }
  return newObj;
}

function isEqual(obj1, obj2) {
  return (
    JSON.stringify(toLowerKeys(obj1)) === JSON.stringify(toLowerKeys(obj2))
  );
}
