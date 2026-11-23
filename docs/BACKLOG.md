# Perfectum: Backlog

The work left for Version 2, in the order it will be built. What is in Version 2 is decided in [SCOPE.md](SCOPE.md); this file only tracks progress on it. Designs are in [Hifi](Hifi/), behaviour in [RULES.md](RULES.md), routes in [ENDPOINTS.md](ENDPOINTS.md).

Tick an item when it works in the browser against the real database and is committed.

---

## Done

- [x] Serve the `client` folder from Express
- [x] Main page HTML and CSS (header, Active and Inactive cards)
- [x] Load goals from the API into both lists
- [x] Build full goal rows: title, sub-goal count, progress bar, "x out of n"
- [x] **31** Completed date and full bar on completed goals
- [x] **32** `>>>` button on each row
- [x] **33** Empty-state message when a list is empty
- [x] Goal lists scroll after three rows, with orange scroll bars
- [x] Red cap on goals with no progress
- [x] Remove the hand-written sample rows
- [x] **34** New-goal pop-up opens and closes

---

## Now: new-goal pop-up

- [x] **35** Style the pop-up from the design: glass panel, `::backdrop` blur
- [x] **36** Form fields: title and description, with character counters that turn red at the limit
- [ ] **37** Sub-goals card: add sub-goals inline (empty title on blur removes the row; trim before checking), with its own scroll bar
- [ ] **38** Save: `POST /goals` with `subGoals`, close the pop-up, reload the Active list
- [ ] **39** Show the API's error message in the pop-up when saving fails (for example, a missing title)

Decided: the description limit stays 500, matching the API.

## Next: goal pop-up

- [ ] **40** `>>>` opens the goal pop-up for that goal (`GET /goals/:goalId`)
- [ ] **41** Show title, description, progress and sub-goals (no / one / many sub-goals)
- [ ] **42** Rename the goal and edit its description (saves on Enter or when the field loses focus)
- [ ] **43** Complete and uncomplete sub-goals
- [ ] **44** Add, edit and delete sub-goals
- [ ] **45** Complete the goal (greyed out while sub-goals are unfinished) and "Mark it incomplete", with "Completed at"
- [ ] **46** Archive the goal
- [ ] **47** Refresh both lists after any change

## Then: delete flow

- [ ] **48** Delete confirm pop-up (YES / cancel)
- [ ] **49** "Deleting…" undo screen: delay the `DELETE` with `setTimeout`, Cancel calls `clearTimeout`
- [ ] **50** "Deleted" screen, then refresh the lists

## Then: archived goal pop-up

- [ ] **51** `>>>` on an Inactive goal opens the archived pop-up (4 states in the design)
- [ ] **52** View-only, apart from rename, unarchive and delete

## Then: finish Version 2

- [ ] **53** Errors: every request shows the API's message instead of failing silently
- [ ] **54** README: how to run the API and the front end together
- [ ] **55** README screenshots of the page and every pop-up
- [ ] **56** Update the Version 2 status in SCOPE.md
- [ ] **57** Tag `v2.0.0` on GitHub

---

## Small fixes

Found while building. None of them blocks Version 2.

- [ ] A goal with no sub-goals reads "0 Subgoals" but "0 out of 1 subgoals completed"
- [ ] The `complete` bar colour barely differs from a normal fill
- [ ] Round the right edge of the red cap to match the design
- [ ] Re-check the new-goal pop-up's top and bottom spacing once the fields are in (10px top vs about 48px bottom now)
- [ ] Consistent quotes and spacing in app.js and index.html (`id="..."`, `>= 1`, missing `;`)

## If time allows

- [ ] Dark theme, with colours moved into CSS variables (SCOPE.md: light theme first)

Anything else goes on the Nice to have or Later lists in [SCOPE.md](SCOPE.md), not here.
