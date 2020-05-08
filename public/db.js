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

    const items = budgetStore.getAll();

    items.onsuccess = function () {
      // if the db is done being read
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
  const db = request.result;

  const transaction = db.transaction(["waiting"], "readwrite");
  const budgetStore = transaction.objectStore("waiting");
  budgetStore.add(item);
}

// when back online, check for new data in db
window.addEventListener("online", function () {
  const transaction = db.transaction(["waiting"], "readwrite");
  const budgetStore = transaction.objectStore("waiting");

  // initialize items array to be filled with db data
  const items = budgetStore.getAll();

  items.onsuccess = function () {
    // if the db is done being read

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