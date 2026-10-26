# Perfectum: Scope

What this project includes, what it might include, and what it deliberately does not. Behavior details live in [RULES.md](RULES.md).

## Objective

A goal tracking REST API. V2 adds a front end. A user creates goals, breaks them into sub-goals, checks them off, and archives goals they want to pause or keep as history.

- Single-user project (no accounts or login).
- Built in about two weeks, as a portfolio piece. Version 1 (the API) had a 5-day target and a 7-day hard deadline. Version 2 (the front end) gets one more week with the same targets, counted from the first day of front-end coding.

**Stack:** Node.js, Express, MongoDB with Mongoose. Tested with Insomnia.

| Version | Status |
|---|---|
| Version 1 | Done (v1.0.0) |
| Version 2 | In planning |

---

## Version 1

Version 1 is done when every item below works and is documented.

**Goals**
- Create, view, rename/edit, and delete goals
- Deleting a goal also deletes its sub-goals
- Mark a goal complete and unmark it, with the guard rule and the automatic unmark
- Separate Active and Inactive lists
- Archive and unarchive goals
- Delete an Inactive goal

**Sub-goals**
- Add, edit, delete, complete, and uncomplete sub-goals
- Progress shown as "x out of n", calculated on demand

**Data and validation**
- Creation and completion dates, set automatically
- Required goal title
- A maximum number of sub-goals per goal, with the exact number set to 20

**Definition of done**
- README with project description, how to run it, and the list of endpoints
- `.env.example` with no real secrets
- `docs/` folder with rules, scope, data model, and endpoints
- Pushed to GitHub with small, clearly named commits
- Tagged `v1.0.0` on GitHub when finished

## Version 2

Version 2 is a browser front end for the Perfectum API, in a `client` folder in the same repository. The only API change is an optional goal description, which the wireframes need. Version 2 is done when every item below works and is documented.

**API change**
- Optional `description` on goals, set when creating and changed when editing (Goals Rule 10)

**Page**
- One page, with the Active goals list above the Inactive (archived) goals list
- Each goal row shows its title, sub-goal count, progress as "x out of n", and the completed date if it has one
- An empty state for new users ("Create your first goal") and for an empty Inactive list ("No archived goals")
- Pop-ups for creating a goal, viewing a goal with its sub-goals, and confirming a delete

**Actions**
- Create, rename, and delete goals, and add or edit a goal's description (rename saves on Enter or when the title loses focus)
- Archive and unarchive goals
- Complete and uncomplete goals and sub-goals
- Add, edit, and delete sub-goals
- Archived goals are view-only, apart from renaming, unarchiving, and deleting
- Show the API's error messages to the user instead of failing silently

**Design and build**
- Low-fidelity wireframes first (one page, plus the pop-ups), then a high-fidelity design in Figma
- Desktop first
- Light theme first, with a dark theme added at the end if time allows (colours set as CSS variables)
- Plain HTML, CSS, and JavaScript, using `fetch` to call the API (no frameworks)

**Definition of done**
- README updated with how to run the API and the front end together
- Screenshots of the page and its pop-ups in the README
- Pushed to GitHub with small, clearly named commits
- Tagged `v2.0.0` on GitHub when finished

---

## Nice to have

| Item | Reason it isn't in Version 1 or 2 |
|---|---|
| Deadlines on goals and sub-goals | Adds a new field and new rules (what happens when one passes) |
| A few automated tests on the core rules | Valuable, but the API must work first |
| Insomnia collection exported into the repo | Helpful for reviewers, not needed for the API to work |
| Sorting and filtering the goal lists | Useful, but the lists work without it |

---

## Later

| Item | Reason |
|---|---|
| User accounts and login  | Needs authentication and per-user data; too large for one week |
| Live deployment | Depends on current free hosting options; only after Version 2 works, so the front end has a live API to use |
| Description field on goals | Needs a new schema field and changes to the create and edit routes; would ship as API version 1.1.0 |
| Habit tracking | Needs a new kind of data (check-ins over time), not just done/not done |
| Gym tracking and nutrition tracking | Separate features that could plug into goals later |
| TypeScript migration | Finish the app in plain JavaScript first, then convert |
| Phone layout (media queries) | Version 2 is desktop first |

---

## Not part of the API

- **Show / Hide:** a screen feature. The API only returns data, and a front end decides what to display.
- **A user interface:** the API itself has no front end. The front end is Version 2 and lives in the `client` folder.

---

## Changing the scope

Any new idea goes on the Nice to have or Later list first. It moves into Version 2 only if something else of equal size moves out.