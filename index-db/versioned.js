/** Open or Create a Database: */
const dbName = 'myDatabase';
const version = 1;

async function openDatabase() {
  const request = indexedDB.open(dbName, version);

  return new Promise((resolve, reject) => {
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = event => {
      const db = event.target.result;
      
      // Create multiple object stores
      const store1 = db.createObjectStore('store1', { keyPath: 'id', autoIncrement: true });
      const store2 = db.createObjectStore('store2', { keyPath: 'id' });

      // Add indexes to object stores
      store1.createIndex('name', 'name', { unique: false });
      store2.createIndex('email', 'email', { unique: true });
    };
  });
}

/**  Open the database using async/await */
async function initDB() {
  try {
    const db = await openDatabase();
    console.log("Database opened successfully");
    return db;
  } catch (error) {
    console.error("Error opening database:", error);
  }
}
/** Adding Data: **/
async function addData(db) {
  const transaction = db.transaction(['store1', 'store2'], 'readwrite');
  const store1 = transaction.objectStore('store1');
  const store2 = transaction.objectStore('store2');

  const data1 = { name: 'Alice', age: 25 };
  const data2 = { email: 'alice@example.com', address: { city: 'New York', country: 'USA' } };

  try {
    await store1.add(data1);
    await store2.add(data2);
    console.log("Data added successfully");
  } catch (error) {
    console.error("Error adding data:", error);
  }
}
/** Reading Data: */
async function readData(db) {
  const transaction = db.transaction(['store1', 'store2'], 'readonly');
  const store1 = transaction.objectStore('store1');
  const store2 = transaction.objectStore('store2');

  try {
    const data1 = await store1.getAll();
    const data2 = await store2.getAll();
    console.log("Data from store1:", data1);
    console.log("Data from store2:", data2);
  } catch (error) {
    console.error("Error reading data:", error);
  }
}

// Storing complex data types (array of objects)
/** Save Complex Data Types:*/
async function saveComplexData(db) {
  const transaction = db.transaction(['store1'], 'readwrite');
  const store1 = transaction.objectStore('store1');

  const complexData = [
    { name: 'Bob', age: 30 },
    { name: 'Carol', age: 28 }
  ];

  try {
    await store1.add(complexData);
    console.log("Complex data added successfully");
  } catch (error) {
    console.error("Error adding complex data:", error);
  }
}
