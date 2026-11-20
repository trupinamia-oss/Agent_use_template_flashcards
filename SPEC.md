
# Spec: Vocab Flashcards
## Goal (one or two sentences)
A single-page website where I can add English–German word pairs
and practise them as flashcards. Data is saved in the browser.
## Users
Just me, on a laptop browser.
## Features (numbered, so prompts can refer to them)
F1. Add a word pair (English + German) with a form.
F2. Show all saved word pairs in a list.
F3. Delete a word pair from the list.
F4. Save pairs in localStorage so they survive a page reload.
F5. Practice mode: show one English word, click to reveal German.
F6. "Next" button shows a random different card.
F7. Count how many cards I marked "I knew it" this session.
## Acceptance criteria (how I know a feature works)
- F1: Empty fields cannot be submitted. After adding, the form is cleared.
- F4: After reload, all pairs are still there.
- F6: The same card never appears twice in a row (if there are 2+ cards).
## Out of scope (do NOT build)
- No login, no server, no database
- No frameworks or libraries (no React, no jQuery, no Bootstrap)
- No sound, no animations beyond simple CSS transitions
- No mobile app
## Look & feel
Simple, readable, one column, max width ~600px, one accent colour.

