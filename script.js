const trainingForm = document.querySelector("#training-form");
const trainingType = document.querySelector("#training-type");
const trainingDuration = document.querySelector("#training-duration");
const trainingEffort = document.querySelector("#training-effort");
const trainingList = document.querySelector("#training-list");
const entryCount = document.querySelector("#entry-count");

let trainingEntries = loadEntries();

// Loads training entries saved in the browser.
function loadEntries() {
  const savedEntries = localStorage.getItem("trainingEntries");

  if (savedEntries === null) {
    return [];
  }

  return JSON.parse(savedEntries);
}

// Saves all training entries in the browser.
function saveEntries() {
  localStorage.setItem("trainingEntries", JSON.stringify(trainingEntries));
}

// Adds a completed training unit to the diary.
function addTrainingEntry(event) {
  event.preventDefault();

  const duration = trainingDuration.value;

  if (trainingType.value === "" || duration === "" || trainingEffort.value === "") {
    return;
  }

  trainingEntries.unshift({
    type: trainingType.value,
    duration: duration,
    effort: trainingEffort.value,
    date: new Date().toLocaleDateString("de-DE")
  });

  saveEntries();
  trainingForm.reset();
  showEntries();
}

// Displays all saved training entries.
function showEntries() {
  trainingList.innerHTML = "";

  if (trainingEntries.length === 0) {
    entryCount.textContent = "Noch keine Einträge.";
  } else {
    entryCount.textContent = trainingEntries.length + " Trainingseinheit(en)";
  }

  for (let index = 0; index < trainingEntries.length; index++) {
    const entry = trainingEntries[index];
    const listItem = document.createElement("li");
    const details = document.createElement("div");

    details.className = "entry-details";
    details.innerHTML =
      "<strong>" + entry.type + "</strong><br>" +
      entry.duration + " Minuten<br>" +
      "Anstrengung: " + entry.effort + "/5<br>" +
      entry.date;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Löschen";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", function () {
      deleteEntry(index);
    });

    listItem.appendChild(details);
    listItem.appendChild(deleteButton);
    trainingList.appendChild(listItem);
  }
}

// Removes one training entry from the diary.
function deleteEntry(index) {
  trainingEntries.splice(index, 1);
  saveEntries();
  showEntries();
}

trainingForm.addEventListener("submit", addTrainingEntry);
showEntries();