import axios from "axios";

export async function synchronizeAnswers(db) {
  const sqliteData = await querySQLiteData(db);
  const postgresData = await queryPostgreSQLData();

  sqliteData.forEach((sqliteRow) => {
    const correspondingRow = postgresData.answers.find(
      (element) => element.id === sqliteRow.id
    );

    if (correspondingRow !== undefined) {
      if (!isEqual(correspondingRow, sqliteRow)) {
        updateDataInPostgreSQL(sqliteRow);
      }
    } else {
      insertDataToPostgreSQL(sqliteRow);
    }
  });

  postgresData.answers.forEach((postgresRow) => {
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

async function queryPostgreSQLData() {
  try {
    let reqOptions = {
      url: "https://midapp.onrender.com/answers/retrieve",
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
      url: "https://midapp.onrender.com/answers/add",
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
      url: "https://midapp.onrender.com/answers/update",
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
      url: "https://midapp.onrender.com/answers/delete",
      data: data,
    };
    const response = await axios.request(config);
    console.log("Data deleted from PostgreSQL:", response.data);
  } catch (error) {
    console.error("Error inserting data into PostgreSQL:", error);
    throw error;
  }
}

const isEqual = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];
    const areObjects = val1 instanceof Object && val2 instanceof Object;

    if (
      (areObjects && !isEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
};
