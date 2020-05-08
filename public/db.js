const request = window.indexedDB.open("budget", 1);

// Create schema
request.onupgradeneeded = event => {
  const db = event.target.result;

  const budgetStore = db.createObjectStore("waiting", {
    autoIncrement: true
  });

};

request.onsuccess = () => {
  const db = request.result;
  if (navigator.onLine) {
    const transaction = db.transaction(["waiting"], "readwrite");
    const budgetStore = transaction.objectStore("waiting");

    // initialize items array to be filled with db data
    const items = [];
    const getCursorRequest = budgetStore.openCursor();
    getCursorRequest.onsuccess = event => {
      const cursor = event.target.result;
      if (cursor) {
        items.push(cursor.value);
        cursor.continue();
      } else {
        console.log("No documents left");
      }
    };
    // const items = budgetStore.getAll();

    // items.onsuccess = function () {
    // if the db is done being read
    if (!cursor) {
      if (items.result.length > 0) {
        fetch("/api/transaction/bulk", {
          method: "POST",
          body: JSON.stringify(items.result),
        })
          .then(res => {
            return res.json();
          })
          .then(() => {
            const transaction = db.transaction(["waiting"], "readwrite");
            const budgetStore = transaction.objectStore("waiting");
            budgetStore.clear();
          });
      }
    }
  }

};

function saveRecord(item) {
  const transaction = db.transaction(["waiting"], "readwrite");
  const budgetStore = transaction.objectStore("waiting");
  budgetStore.add(item);
}

// when back online, check for new data in db
window.addEventListener("online", function () {
  const transaction = db.transaction(["waiting"], "readwrite");
  const budgetStore = transaction.objectStore("waiting");

  // initialize items array to be filled with db data
  const items = [];
  const getCursorRequest = budgetStore.openCursor();
  getCursorRequest.onsuccess = event => {
    const cursor = event.target.result;
    if (cursor) {
      items.push(cursor.value);
      cursor.continue();
    } else {
      console.log("No documents left");
    }
  };

  // if the db is done being read
  if (!cursor) {
    if (items.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(items.result),
      })
        .then(res => {
          return res.json();
        })
        .then(() => {
          const transaction = db.transaction(["waiting"], "readwrite");
          const budgetStore = transaction.objectStore("waiting");
          budgetStore.clear();
        });
    }
  }
})