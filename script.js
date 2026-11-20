const wordForm = document.querySelector("#word-form");
const englishInput = document.querySelector("#english-word");
const germanInput = document.querySelector("#german-word");
const wordList = document.querySelector("#word-list");
const flashcard = document.querySelector("#flashcard");
const cardText = document.querySelector("#card-text");
const knewButton = document.querySelector("#knew-button");
const nextButton = document.querySelector("#next-button");
const practiceCount = document.querySelector("#practice-count");

let wordPairs = loadWordPairs();
let currentCardIndex = -1;
let cardIsRevealed = false;
let knownCount = 0;

// Loads saved word pairs from localStorage.
function loadWordPairs() {
  const savedPairs = localStorage.getItem("vocabFlashcards");

  if (savedPairs === null) {
    return [];
  }

  return JSON.parse(savedPairs);
}

// Saves all word pairs to localStorage.
function saveWordPairs() {
  localStorage.setItem("vocabFlashcards", JSON.stringify(wordPairs));
}

// Adds a new word pair after checking the form fields.
function addWordPair(event) {
  event.preventDefault();

  const englishWord = englishInput.value.trim();
  const germanWord = germanInput.value.trim();

  if (englishWord === "" || germanWord === "") {
    return;
  }

  wordPairs.push({
    english: englishWord,
    german: germanWord
  });

  saveWordPairs();
  wordForm.reset();
  englishInput.focus();
  showWordList();
  showNextCard();
}

// Displays every saved word pair with a delete button.
function showWordList() {
  wordList.innerHTML = "";

  for (let index = 0; index < wordPairs.length; index++) {
    const pair = wordPairs[index];
    const listItem = document.createElement("li");

    const pairText = document.createElement("span");
    pairText.textContent = pair.english + " - " + pair.german;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Löschen";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", function () {
      deleteWordPair(index);
    });

    listItem.appendChild(pairText);
    listItem.appendChild(deleteButton);
    wordList.appendChild(listItem);
  }
}

// Removes one word pair from the saved list.
function deleteWordPair(index) {
  wordPairs.splice(index, 1);
  saveWordPairs();
  currentCardIndex = -1;
  showWordList();
  showNextCard();
}

// Chooses a random card and avoids repeating the same card.
function showNextCard() {
  if (wordPairs.length === 0) {
    currentCardIndex = -1;
    cardIsRevealed = false;
    cardText.textContent = "Noch keine Karten vorhanden.";
    knewButton.disabled = true;
    nextButton.disabled = true;
    return;
  }

  let nextIndex = currentCardIndex;

  if (wordPairs.length === 1) {
    nextIndex = 0;
  } else {
    while (nextIndex === currentCardIndex) {
      nextIndex = Math.floor(Math.random() * wordPairs.length);
    }
  }

  currentCardIndex = nextIndex;
  cardIsRevealed = false;
  cardText.textContent = wordPairs[currentCardIndex].english;
  knewButton.disabled = false;
  nextButton.disabled = false;
}

// Reveals or hides the German translation.
function revealCard() {
  if (currentCardIndex === -1) {
    return;
  }

  if (cardIsRevealed) {
    cardText.textContent = wordPairs[currentCardIndex].english;
  } else {
    cardText.textContent = wordPairs[currentCardIndex].german;
  }

  cardIsRevealed = !cardIsRevealed;
}

// Counts one card as known for this practice session.
function markCardAsKnown() {
  if (currentCardIndex === -1) {
    return;
  }

  knownCount++;
  practiceCount.textContent = "Ich wusste " + knownCount + " Karten.";
  showNextCard();
}

wordForm.addEventListener("submit", addWordPair);
flashcard.addEventListener("click", revealCard);
knewButton.addEventListener("click", markCardAsKnown);
nextButton.addEventListener("click", showNextCard);

showWordList();
showNextCard();