# Perfectum

A goal tracking REST API with sub-goals, built with Node.js, Express, and MongoDB.

> **Status:** In development (Version 1). !!

Perfectum lets a user create goals, break them into sub-goals, check them off, and archive goals they want to pause or keep as history. It is a single-user project built as a portfolio piece.

*Perfectum is an independent personal project and is not affiliated with any other product of the same name.* !!

---

## Features (Version 1)

- Create, view, rename, and delete goals
- Add, edit, delete, check, and uncheck sub-goals (up to 20 per goal)
- Progress shown as "x out of n", calculated on request
- Mark goals complete and unmark them, with guard rules (a goal with sub-goals can only be completed when all are done)
- Archive and unarchive goals, with separate Active and Inactive lists
- Creation and completion dates, set automatically

See [docs/SCOPE.md](docs/SCOPE.md) for what is in Version 1, what might come next, and what is out of scope.

---

## Tech stack

- Node.js
- Express
- MongoDB with Mongoose
- Insomnia for testing requests

---

## Getting started

> Fill in and test these steps once the app runs. A stranger should be able to follow them without asking you anything.

**Requirements:** Node.js (version: TODO) and a MongoDB database, either local or hosted.

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd <your-repo-folder>

# 2. Install dependencies
npm install

# 3. Create your environment file from the example, then edit the values
cp .env.example .env

# 4. Start the server (TODO: confirm the script name)
npm start
```

### Environment variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the server listens on | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/perfectum` |
| `MAX_SUB_GOALS` | Maximum sub-goals per goal | `20` |

Never commit your real `.env` file. Only `.env.example` belongs in the repo.

---

## API overview

All requests and responses are JSON. Full details, including request bodies, responses, and errors, are in [docs/ENDPOINTS.md](docs/ENDPOINTS.md).

| Method | Path | Action |
|---|---|---|
| `POST` | `/goals` | Create a goal |
| `GET` | `/goals` | List goals (`?archived=true` for the archive) |
| `GET` | `/goals/:goalId` | Get one goal |
| `PATCH` | `/goals/:goalId` | Rename or edit a goal |
| `DELETE` | `/goals/:goalId` | Delete a goal and its sub-goals |
| `POST` | `/goals/:goalId/complete` | Mark a goal complete |
| `POST` | `/goals/:goalId/uncomplete` | Unmark a goal as complete |
| `POST` | `/goals/:goalId/archive` | Archive a goal |
| `POST` | `/goals/:goalId/unarchive` | Unarchive a goal |
| `POST` | `/goals/:goalId/subgoals` | Add a sub-goal |
| `PATCH` | `/goals/:goalId/subgoals/:subGoalId` | Edit a sub-goal |
| `DELETE` | `/goals/:goalId/subgoals/:subGoalId` | Delete a sub-goal |
| `POST` | `/goals/:goalId/subgoals/:subGoalId/check` | Check a sub-goal |
| `POST` | `/goals/:goalId/subgoals/:subGoalId/uncheck` | Uncheck a sub-goal |

### Example request and response

> TODO: add one real request and response once the API works (a "Nice to have" item).

---

## Key business rules

- A goal with sub-goals can only be completed once all of its sub-goals are done. Otherwise the request is refused.
- Unchecking a sub-goal, or adding a new one, automatically unmarks a completed goal.
- Archiving is always manual and does not change whether a goal is complete.
- Inactive (archived) goals can be read, renamed, and deleted, but their sub-goals cannot be changed until the goal is unarchived.
- Deleting a goal deletes its sub-goals.
- Repeating an action that would change nothing is refused with `409`.

The full list, with the reason behind each rule, is in [docs/RULES.md](docs/RULES.md).

---

## Documentation

| Document | What it covers |
|---|---|
| [docs/SCOPE.md](docs/SCOPE.md) | What is in Version 1, what is next, what is out of scope |
| [docs/RULES.md](docs/RULES.md) | How the API behaves, and why |
| [docs/DATA_MODEL.md](docs/DATA_MODEL.md) | Fields stored for goals and sub-goals |
| [docs/ENDPOINTS.md](docs/ENDPOINTS.md) | Every endpoint, with requests, responses, and errors |

---

## What's next

Ideas that are not part of Version 1: deadlines, automated tests, user accounts, live deployment, and habit tracking. See [docs/SCOPE.md](docs/SCOPE.md).