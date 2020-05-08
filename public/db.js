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
    var done = true;
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
        done = false;
      } else {
        console.log("No documents left");
        done = true;
      }
    };
    // const items = budgetStore.getAll();

    // items.onsuccess = function () {
    // if the db is done being read
    if (done) {
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
  var done = true;
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
      done = false;
    } else {
      console.log("No documents left");
      done = true;
    }
  };

  // if the db is done being read
  if (done) {
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