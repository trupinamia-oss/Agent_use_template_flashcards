const storageKey = "trainingEntries";
const trainingForm = document.querySelector("#training-form");
const trainingList = document.querySelector("#training-list");
const entryCount = document.querySelector("#entry-count");
const formMessage = document.querySelector("#form-message");
const durationSelect = document.querySelector("#training-duration");
const customDurationContainer = document.querySelector("#custom-duration-container");
const customDurationInput = document.querySelector("#custom-duration");
const trainingTypeSelect = document.querySelector("#training-type");
const otherTrainingContainer = document.querySelector("#other-training-container");
const otherTrainingInput = document.querySelector("#other-training-description");

let trainingEntries = loadEntries();

// Shows the detail field when "Sonstiges" is selected.
function showOtherTrainingField() {
  const needsDescription = trainingTypeSelect.value === "Sonstiges";
  otherTrainingContainer.hidden = !needsDescription;
  otherTrainingInput.required = needsDescription;
}

// Shows the custom duration field when needed.
function showCustomDuration() {
  const needsCustomDuration = durationSelect.value === "custom";
  customDurationContainer.hidden = !needsCustomDuration;
  customDurationInput.required = needsCustomDuration;
}

// Reads saved training entries from the browser.
function loadEntries() {
  const savedEntries = localStorage.getItem(storageKey);

  if (savedEntries === null) {
    return [];
  }

  const entries = JSON.parse(savedEntries);
  return Array.isArray(entries) ? entries : [];
}

// Saves the current training entries in the browser.
function saveEntries() {
  localStorage.setItem(storageKey, JSON.stringify(trainingEntries));
}

// Saves one training session submitted on the diary page.
function addTrainingEntry(event) {
  event.preventDefault();

  const type = trainingTypeSelect.value;
  const otherDescription = otherTrainingInput.value.trim();
  const selectedDuration = durationSelect.value;
  let duration = Number(selectedDuration);
  const sessionRpeValue = document.querySelector("#session-rpe").value;
  const sessionRpe = Number(sessionRpeValue);

  if (selectedDuration === "custom") {
    duration = Number(customDurationInput.value);
  }

  if (
    type === "" ||
    (type === "Sonstiges" && otherDescription === "") ||
    !Number.isInteger(duration) ||
    duration < 1 ||
    duration > 600 ||
    selectedDuration === "" ||
    sessionRpeValue === "" ||
    !Number.isInteger(sessionRpe) ||
    sessionRpe < 0 ||
    sessionRpe > 10
  ) {
    formMessage.textContent = "Bitte gib eine gültige Dauer und Session-RPE von 0 bis 10 an.";
    return;
  }

  trainingEntries.unshift({
    type: type,
    description: type === "Sonstiges" ? otherDescription : "",
    duration: duration,
    sessionRpe: sessionRpe,
    savedAt: new Date().toISOString()
  });

  saveEntries();
  trainingForm.reset();
  showCustomDuration();
  showOtherTrainingField();
  formMessage.textContent = "Trainingseinheit gespeichert!";
  showEntries();
}

// Shows saved training sessions on the diary page.
function showEntries() {
  trainingList.textContent = "";

  if (trainingEntries.length === 0) {
    entryCount.textContent = "Noch keine Einträge.";
    return;
  }

  entryCount.textContent = trainingEntries.length + " Trainingseinheit(en)";

  for (let index = 0; index < trainingEntries.length; index++) {
    addEntryToList(trainingEntries[index], index);
  }
}

// Creates one row in the training list.
function addEntryToList(entry, index) {
  const item = document.createElement("li");
  const details = document.createElement("div");
  const deleteButton = document.createElement("button");
  const date = new Date(entry.savedAt).toLocaleDateString("de-DE");
  const sessionRpe = getSessionRpe(entry);
  const sessionLoad = Number(entry.duration) * sessionRpe;

  details.className = "entry-details";
  const trainingName = entry.type === "Sonstiges" && entry.description
    ? entry.type + ": " + entry.description
    : entry.type;
  details.textContent = trainingName + " – " + entry.duration +
    " Minuten – Session-RPE " + sessionRpe + "/10 – sRPE-Last " +
    sessionLoad + " – " + date;

  deleteButton.textContent = "Löschen";
  deleteButton.className = "delete-button";
  deleteButton.addEventListener("click", function () {
    deleteEntry(index);
  });

  item.appendChild(details);
  item.appendChild(deleteButton);
  trainingList.appendChild(item);
}

// Deletes one training session and refreshes the diary.
function deleteEntry(index) {
  trainingEntries.splice(index, 1);
  saveEntries();
  showEntries();
}

// Reads the current Session-RPE or an older saved effort value.
function getSessionRpe(entry) {
  if (entry.sessionRpe !== undefined) {
    return Number(entry.sessionRpe);
  }

  return Number(entry.effort) * 2;
}

// Returns entries saved during the last seven days.
function getRecentEntries() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 7);
  return trainingEntries.filter(function (entry) {
    return new Date(entry.savedAt) >= cutoffDate;
  });
}

// Limits a score to a whole number between zero and 100.
function limitValue(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

// Updates a statistic and its progress bar on the avatar page.
function setAvatarValue(name, value) {
  const number = document.querySelector("#" + name + "-value");
  const bar = document.querySelector("#" + name + "-bar");

  if (number && bar) {
    number.textContent = value;
    bar.style.width = value + "%";
  }
}

// Calculates avatar statistics from the last seven days.
function showAvatar() {
  const weekLabel = document.querySelector("#training-week");

  if (weekLabel === null) {
    return;
  }

  const recentEntries = getRecentEntries();
  const scores = { endurance: 0, strength: 0, technique: 0 };

  for (let index = 0; index < recentEntries.length; index++) {
    addTrainingPoints(recentEntries[index], scores);
  }

  weekLabel.textContent = recentEntries.length +
    " Trainingseinheit(en) in den letzten sieben Tagen.";
  setAvatarValue("endurance", limitValue(scores.endurance * 8));
  setAvatarValue("strength", limitValue(scores.strength * 8));
  setAvatarValue("skill", limitValue(scores.technique * 8));
  setAvatarValue("regularity", limitValue(recentEntries.length * 20));
}

// Calculates avatar values without changing saved training data.
function addTrainingPoints(entry, scores) {
  const points = Number(entry.duration) * getSessionRpe(entry) / 30;

  if (entry.type === "Ausdauer") {
    scores.endurance += points;
  } else if (entry.type === "Kraft") {
    scores.strength += points;
  } else {
    scores.technique += points;
  }
}

// Displays the team's weekly summary and matching story chapter.
function showTeamProgress() {
  const teamLabel = document.querySelector("#team-training");

  if (teamLabel === null) {
    return;
  }

  const recentEntries = getRecentEntries();
  let totalMinutes = 0;

  for (let index = 0; index < recentEntries.length; index++) {
    totalMinutes += Number(recentEntries[index].duration);
  }

  const progress = limitValue(recentEntries.length * 20);
  teamLabel.textContent = recentEntries.length +
    " Einheiten und " + totalMinutes + " Minuten diese Woche.";
  setTeamValue("team-training-count", recentEntries.length);
  setTeamValue("team-minutes", totalMinutes);
  setTeamValue("team-progress", progress + "%");
  setTeamValue("team-regularity", progress + "%");
  showStoryStage(progress);
}

// Updates one number in the team summary.
function setTeamValue(id, value) {
  const element = document.querySelector("#" + id);

  if (element) {
    element.textContent = value;
  }
}

// Selects the team's current story chapter from its progress.
function showStoryStage(progress) {
  const stageName = document.querySelector("#story-name");
  const stageText = document.querySelector("#story-text");
  const stages = [
    ["Vorbereitung", "Das Team startet gemeinsam in die Saisonvorbereitung."],
    ["Hinrunde", "Das Team geht mit Schwung in die Hinrunde."],
    ["Pause", "Zeit zum Erholen und Kraft sammeln."],
    ["Rückrunde", "Gemeinsam startet das Team in die Rückrunde."],
    ["Saisonende", "Das Team erreicht gemeinsam das Saisonende!"]
  ];
  const stageIndex = Math.min(4, Math.floor(progress / 20));

  if (stageName && stageText) {
    stageName.textContent = stages[stageIndex][0];
    stageText.textContent = stages[stageIndex][1];
  }
}

if (trainingForm) {
  trainingForm.addEventListener("submit", addTrainingEntry);
  durationSelect.addEventListener("change", showCustomDuration);
  trainingTypeSelect.addEventListener("change", showOtherTrainingField);
  showCustomDuration();
  showOtherTrainingField();
  showEntries();
}

showAvatar();
showTeamProgress();