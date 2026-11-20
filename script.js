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
    date: new Date().toLocaleDateString("de-DE"),
    savedAt: new Date().toISOString()
  });

  saveEntries();
  trainingForm.reset();
  showEntries();
  showAvatar();
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
  showAvatar();
}

// Calculates simple avatar values from entries of the last seven days.
function showAvatar() {
  const recentEntries = getRecentEntries();
  const trainingWeek = document.querySelector("#training-week");

  if (trainingWeek === null) {
    return;
  }

  if (recentEntries.length === 0) {
    trainingWeek.textContent = "Noch keine Trainingseinheit diese Woche.";
  } else {
    trainingWeek.textContent =
      recentEntries.length + " Trainingseinheit(en) in den letzten sieben Tagen.";
  }

  let endurancePoints = 0;
  let strengthPoints = 0;
  let skillPoints = 0;

  for (let index = 0; index < recentEntries.length; index++) {
    const entry = recentEntries[index];
    const effort = Number(entry.effort);
    const duration = Number(entry.duration);

    if (entry.type === "Ausdauer") {
      endurancePoints = endurancePoints + effort + duration / 30;
    } else if (entry.type === "Kraft") {
      strengthPoints = strengthPoints + effort + duration / 30;
    } else {
      skillPoints = skillPoints + effort + duration / 30;
    }
  }

  const endurance = limitValue(endurancePoints * 8);
  const strength = limitValue(strengthPoints * 8);
  const skill = limitValue(skillPoints * 8);
  const regularity = limitValue(recentEntries.length * 20);

  setAvatarValue("endurance", endurance);
  setAvatarValue("strength", strength);
  setAvatarValue("skill", skill);
  setAvatarValue("regularity", regularity);
}

// Finds entries that are no older than seven days.
function getRecentEntries() {
  const recentEntries = [];
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  for (let index = 0; index < trainingEntries.length; index++) {
    const entry = trainingEntries[index];

    if (entry.savedAt) {
      const entryDate = new Date(entry.savedAt);

      if (entryDate >= sevenDaysAgo) {
        recentEntries.push(entry);
      }
    }
  }

  return recentEntries;
}

// Keeps an avatar value between zero and 100.
function limitValue(value) {
  if (value > 100) {
    return 100;
  }

  if (value < 0) {
    return 0;
  }

  return Math.round(value);
}

// Updates one avatar value and its progress bar.
function setAvatarValue(name, value) {
  document.querySelector("#" + name + "-value").textContent = value;
  document.querySelector("#" + name + "-bar").style.width = value + "%";
}

if (trainingForm) {
  trainingForm.addEventListener("submit", addTrainingEntry);
  showEntries();
}

showAvatar();