let db;
const dbName = 'myDatabase';

const request = window.indexedDB.open(dbName, 1);

request.onerror = function(event) {
  console.log("Database error: " + event.target.errorCode);
};

request.onsuccess = function(event) {
  db = event.target.result;
  console.log("Database opened successfully");
};

request.onupgradeneeded = function(event) {
  const db = event.target.result;
  const objectStore = db.createObjectStore('myObjectStore', { keyPath: 'id', autoIncrement:true });

  // You can also create indexes on fields
  objectStore.createIndex('name', 'name', { unique: false });

  console.log("Database upgrade complete");
};

/** Add data to the db using db.transaction */
function addData() {
  const transaction = db.transaction(['myObjectStore'], 'readwrite');
  const objectStore = transaction.objectStore('myObjectStore');

  const data = { name: 'John Doe', age: 30 };

  const request = objectStore.add(data);

  request.onsuccess = function(event) {
    console.log("Data added successfully");
  };

  request.onerror = function(event) {
    console.log("Error adding data: " + event.target.errorCode);
  };
}

/** Read data from the db using db.transaction */
function readData() {
  const transaction = db.transaction(['myObjectStore'], 'readonly');
  const objectStore = transaction.objectStore('myObjectStore');

  const request = objectStore.getAll();

  request.onsuccess = function(event) {
    const result = event.target.result;
    console.log("Read data:", result);
  };

  request.onerror = function(event) {
    console.log("Error reading data: " + event.target.errorCode);
  };
}

/** Update data */
function updateData(id, newData) {
  const transaction = db.transaction(['myObjectStore'], 'readwrite');
  const objectStore = transaction.objectStore('myObjectStore');

  const request = objectStore.get(id);

  request.onsuccess = function(event) {
    const data = event.target.result;

    if (data) {
      // Update the properties you want
      data.name = newData.name;
      data.age = newData.age;

      const updateRequest = objectStore.put(data);

      updateRequest.onsuccess = function(event) {
        console.log("Data updated successfully");
      };

      updateRequest.onerror = function(event) {
        console.log("Error updating data: " + event.target.errorCode);
      };
    }
  };

  request.onerror = function(event) {
    console.log("Error getting data for update: " + event.target.errorCode);
  };
}

/** Delete data */
function deleteData(id) {
  const transaction = db.transaction(['myObjectStore'], 'readwrite');
  const objectStore = transaction.objectStore('myObjectStore');

  const request = objectStore.delete(id);

  request.onsuccess = function(event) {
    console.log("Data deleted successfully");
  };

  request.onerror = function(event) {
    console.log("Error deleting data: " + event.target.errorCode);
  };
}

/** CLose DB **/
function closeDatabase() {
  db.close();
  console.log("Database closed");
}


/**
  To avoid callback hell and enhance modularity and code reuse
*/

// Open Database
async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('myDatabase', 1);

    request.onerror = (event) => reject(event.target.errorCode);

    request.onsuccess = (event) => resolve(event.target.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const store1 = db.createObjectStore('store1', { keyPath: 'id', autoIncrement: true });
      const store2 = db.createObjectStore('store2', { keyPath: 'id', autoIncrement: true });
      // ... create more object stores if needed
    };
  });
}

// Add Data
async function asyncAddData(storeName, data) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.add(data);

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.errorCode);
  });
}

// Read Data
async function asyncReadData(storeName) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.getAll();

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.errorCode);
  });
}

// Update Data
async function asyncUpdateData(storeName, id, newData) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    const getRequest = objectStore.get(id);

    getRequest.onsuccess = (event) => {
      const data = event.target.result;
      if (data) {
        // Update data properties
        data.name = newData.name;
        data.age = newData.age;

        const updateRequest = objectStore.put(data);
        updateRequest.onsuccess = (event) => resolve(event.target.result);
        updateRequest.onerror = (event) => reject(event.target.errorCode);
      } else {
        reject('Data not found');
      }
    };

    getRequest.onerror = (event) => reject(event.target.errorCode);
  });
}

// Delete Data
async function asyncDeleteData(storeName, id) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.delete(id);

    request.onsuccess = (event) => resolve();
    request.onerror = (event) => reject(event.target.errorCode);
  });
}

// Example Usage
(async () => {
  try {
    await addData('store1', { name: 'John Doe', age: 30 });
    const data = await readData('store1');
    console.log('Read data:', data);

    await updateData('store1', 1, { name: 'Updated John', age: 35 });
    const updatedData = await readData('store1');
    console.log('Updated data:', updatedData);

    await deleteData('store1', 1);
    const afterDeleteData = await readData('store1');
    console.log('Data after delete:', afterDeleteData);
  } catch (error) {
    console.error('Error:', error);
  }
})();


