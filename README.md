# Perfectum

A goal tracking REST API with sub-goals, built with Node.js, Express, and MongoDB.

> **Status:** Version 1 complete

Perfectum lets a user create goals, break them into sub-goals, check them off, and archive goals they want to pause or keep as history. It is a single-user project built as a portfolio piece.

*Perfectum is an independent personal project and is not affiliated with any other product of the same name.*

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

# Getting started

### Prerequisites:
1. Node.js
2. A MongoDB database (local / Atlas)
    - Mongoose 9 needs Node 20.19 or newer.
3. Copy ``.env.example`` to ``.env``

### Setup:
```bash
git clone https://github.com/ChasingPrograms/Perfectum-API.git
cd Perfectum-API
npm install
```

Create a ``.env`` file in the project root:
```env
MONGODB_URI=your-connection-string-here
PORT=3000
```

Start the server:
```bash
npm start
```

### Trying It:
Create a goal:
```Bash
curl -X POST http://localhost:3000/goals \
  -H "Content-Type: application/json" \
  -d '{"title": "Get fit by December"}'
```

Response (``201``):
```JSON
{
  "_id": "665f1c2e9b1d8a0012a4c111",
  "title": "Get fit by December",
  "completed": false,
  "completedAt": null,
  "archived": false,
  "subGoals": [],
  "createdAt": "2026-10-24T20:00:00.000Z",
  "updatedAt": "2026-10-24T20:00:00.000Z",
"__v": 2,
	"progress": {
		"completed": 0,
		"total": 0
	}
}
```

Adding a sub-goal:
```
curl -X POST http://localhost:3000/goals/665f1c2e9b1d8a0012a4c111/subgoals \
  -H "Content-Type: application/json" \
  -d '{"title": "Gym 3x a week"}'
```

Response (``201``) includes the updated goal with progress:
```JSON
{
  "_id": "665f1c2e9b1d8a0012a4c111",
  "title": "Get fit by December",
  "completed": false,
  "completedAt": null,
  "archived": false,
  "subGoals": [
    {
    "title": "Gym 3x a week", 
    "completed": false,
    "_id": "665f1c2e9b1d8a0012a4c222",
    "createdAt": "2026-10-24T20:00:00.000Z"
     }
  ],
  "createdAt": "2026-10-24T20:00:00.000Z",
  "updatedAt": "2026-10-24T20:01:00.000Z",
  "__v": 1,
	"progress": {
		"completed": 0,
		"total": 1
    }
}
```

**See [docs/ENDPOINTS.md](docs/ENDPOINTS.md) for all 14 endpoints.**

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
| `PATCH` | `/goals/:goalId/complete` | Mark a goal complete |
| `PATCH` | `/goals/:goalId/uncomplete` | Unmark a goal as complete |
| `PATCH` | `/goals/:goalId/archive` | Archive a goal |
| `PATCH` | `/goals/:goalId/unarchive` | Unarchive a goal |
| `POST` | `/goals/:goalId/subgoals` | Add a sub-goal |
| `PATCH` | `/goals/:goalId/subgoals/:subGoalId` | Edit a sub-goal |
| `DELETE` | `/goals/:goalId/subgoals/:subGoalId` | Delete a sub-goal |
| `PATCH` | `/goals/:goalId/subgoals/:subGoalId/complete` | Mark a sub-goal as complete |
| `PATCH` | `/goals/:goalId/subgoals/:subGoalId/uncomplete` | Unmark a sub-goal as complete |

## Key business rules

- A goal with sub-goals can only be completed once all of its sub-goals are done. Otherwise the request is refused.
- Unmarking a sub-goal as complete, or adding a new one, automatically unmarks a completed goal.
- Archiving is always manual and does not change whether a goal is complete.
- - Inactive (archived) goals can be read, renamed, and deleted, but their completion status and sub-goals cannot be changed until the goal is unarchived.
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