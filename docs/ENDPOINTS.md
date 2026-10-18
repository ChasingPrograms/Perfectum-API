# Perfectum: Endpoints

Every action the API offers. Behavior rules live in [RULES.md](RULES.md), field names in [DATA_MODEL.md](DATA_MODEL.md), and what is in Version 1 in [SCOPE.md](SCOPE.md).

## Conventions

- **Format:** requests and responses are JSON.
- **Goal IDs and sub-goal IDs** are the `_id` values from the data model. An ID that is not a valid ID is refused with `400`.
- **Action routes:** completing, unmarking, archiving, and unarchiving each have their own route (for example `POST /goals/:goalId/complete`), not a field you edit. This keeps each rule's refusal message clear.
- **Changing sub-goals returns the whole updated goal,** because a sub-goal change can also change the goal (Goals Rule 4, Sub-goals Rule 5).
- **Repeating an action is refused.** An action that would change nothing, such as archiving a goal that is already archived, is refused with `409` and a message saying the item is already in that state.

### Status codes

| Code | Meaning |
|---|---|
| `200` | Success, with a response body |
| `201` | Created |
| `204` | Success, no body (deleting a goal) |
| `400` | The request is malformed or breaks a validation rule (missing title, title too long, invalid ID) |
| `404` | The goal or sub-goal does not exist |
| `409` | The request is valid, but a rule refuses it in the goal's current state (Inactive goal, unfinished sub-goals, sub-goal limit reached, or the item is already in the state the action would put it in) |

### Error format

```json
{ "error": "A short message explaining what went wrong" }
```

### Goal response shape

Progress is calculated on each request and never stored (Sub-goals Rules 3 and 4).

```json
{
  "_id": "665f1c2e9b1d8a0012a4c111",
  "title": "Get fit by December",
  "completed": false,
  "completedAt": null,
  "archived": false,
  "subGoals": [
    { "_id": "665f1c2e9b1d8a0012a4c222", "title": "Gym 3x a week", "completed": true, "createdAt": "2026-10-18T10:00:00.000Z" },
    { "_id": "665f1c2e9b1d8a0012a4c333", "title": "Meal prep on Sundays", "completed": false, "createdAt": "2026-10-18T10:05:00.000Z" }
  ],
  "progress": { "completed": 1, "total": 2 },
  "createdAt": "2026-10-18T09:55:00.000Z",
  "updatedAt": "2026-10-18T10:05:00.000Z"
}
```

---

## Goals

#### ***Create a goal***
- `POST /goals`
- **Body:** `{ "title": "Get fit by December" }`
- **Does:** Creates an Active, incomplete goal with no sub-goals. Dates are set automatically.
- **Success:** `201` with the new goal.
- **Errors:** `400` if the title is missing, empty, or longer than 100 characters.
- **Rules:** Goals Rule 8, Limits Rule 2.

#### ***List goals***
- `GET /goals` or `GET /goals?archived=true`
- **Does:** Returns Active goals by default, or Inactive goals when `archived=true`. This gives you the Active list and the Archive list.
- **Success:** `200` with a list of goals, including each goal's progress.
- **Errors:** `400` if `archived` is anything other than `true` or `false`.
- **Rules:** Archiving Rules 1 to 4.

#### ***Get one goal***
- `GET /goals/:goalId`
- **Does:** Returns one goal with its sub-goals and progress.
- **Success:** `200` with the goal.
- **Errors:** `400` for an invalid ID, `404` if not found.

#### ***Rename or edit a goal***
- `PATCH /goals/:goalId`
- **Body:** `{ "title": "Get fit by January" }`
- **Does:** Changes the title. Allowed on Active and Inactive goals, since Inactive goals are "read and edit only."
- **Success:** `200` with the updated goal.
- **Errors:** `400` for a missing, empty, or too-long title, `404` if not found.
- **Rules:** Goals Rules 5, 6 and 8.

#### ***Delete a goal***
- `DELETE /goals/:goalId`
- **Does:** Deletes the goal and all of its sub-goals. Works on Active and Inactive goals.
- **Success:** `204`.
- **Errors:** `404` if not found.
- **Rules:** Goals Rules 7 and 9.

---

## Completing and archiving a goal

#### ***Mark a goal complete***
- `POST /goals/:goalId/complete`
- **Does:** Marks the goal complete and records `completedAt`.
- **Success:** `200` with the updated goal.
- **Errors:**
  - `409` if the goal has sub-goals and any are unfinished (the message says unfinished sub-goals remain).
  - `409` if the goal is Inactive.
  - `409` if the goal is already complete.
  - `404` if not found.
- **Rules:** Goals Rules 1, 2, 3 and 6.

#### ***Unmark a goal as complete***
- `POST /goals/:goalId/uncomplete`
- **Does:** Marks the goal not complete and clears `completedAt`.
- **Success:** `200` with the updated goal.
- **Errors:** `409` if the goal is Inactive or is not complete, `404` if not found.
- **Rules:** Goals Rules 3 and 6.

#### ***Archive a goal***
- `POST /goals/:goalId/archive`
- **Does:** Moves the goal to Inactive, whether or not it is complete. Completion is not changed.
- **Success:** `200` with the updated goal.
- **Errors:** `409` if the goal is already Inactive, `404` if not found.
- **Rules:** Archiving Rules 1 to 3.

#### ***Unarchive a goal***
- `POST /goals/:goalId/unarchive`
- **Does:** Moves the goal back to Active. Completion is not changed.
- **Success:** `200` with the updated goal.
- **Errors:** `409` if the goal is already Active, `404` if not found.
- **Rules:** Archiving Rules 2 and 3.

---

## Sub-goals

Sub-goals are stored inside their goal, so every sub-goal route includes the goal's ID. There is no separate "list sub-goals" route, because `GET /goals/:goalId` already returns them. All changes below work only while the goal is Active.

#### ***Add a sub-goal***
- `POST /goals/:goalId/subgoals`
- **Body:** `{ "title": "Run a 5k" }`
- **Does:** Adds an unfinished sub-goal. If the goal was complete, it is automatically unmarked and its `completedAt` is cleared.
- **Success:** `201` with the updated goal.
- **Errors:** `400` for a missing, empty, or too-long title. `409` if the goal is Inactive or already has 20 sub-goals. `404` if the goal is not found.
- **Rules:** Sub-goals Rules 2 and 5, Limits Rules 1 and 2.

#### ***Edit a sub-goal***
- `PATCH /goals/:goalId/subgoals/:subGoalId`
- **Body:** `{ "title": "Run a 10k" }`
- **Does:** Changes the sub-goal's title.
- **Success:** `200` with the updated goal.
- **Errors:** `400` for a missing, empty, or too-long title. `409` if the goal is Inactive. `404` if the goal or sub-goal is not found.
- **Rules:** Sub-goals Rule 2.

#### ***Delete a sub-goal***
- `DELETE /goals/:goalId/subgoals/:subGoalId`
- **Does:** Removes the sub-goal. The goal's completed state does not change, and if it was the last sub-goal, the goal then counts as one item.
- **Success:** `200` with the updated goal.
- **Errors:** `409` if the goal is Inactive. `404` if the goal or sub-goal is not found.
- **Rules:** Sub-goals Rules 2, 4 and 6.

#### ***Check a sub-goal***
- `POST /goals/:goalId/subgoals/:subGoalId/check`
- **Does:** Marks the sub-goal done. It does not complete the goal, because completing a goal is always a separate action.
- **Success:** `200` with the updated goal.
- **Errors:** `409` if the goal is Inactive or the sub-goal is already done. `404` if the goal or sub-goal is not found.
- **Rules:** Sub-goals Rules 2 and 3.

#### ***Uncheck a sub-goal***
- `POST /goals/:goalId/subgoals/:subGoalId/uncheck`
- **Does:** Marks the sub-goal not done. If the goal was complete, it is automatically unmarked and its `completedAt` is cleared.
- **Success:** `200` with the updated goal.
- **Errors:** `409` if the goal is Inactive or the sub-goal is not done. `404` if the goal or sub-goal is not found.
- **Rules:** Goals Rule 4, Sub-goals Rule 2.

---

## Summary

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

That is 14 endpoints, covering every item in Version 1.

---

## Not in Version 1

- No sorting or filtering of goal lists beyond `archived` (Nice to have in SCOPE.md).
- No deadline fields or deadline routes.
- No login or user routes, since Perfectum is single-user.# Perfectum: Endpoints

Every action the API offers. Behavior rules live in [RULES.md](RULES.md), field names in [DATA_MODEL.md](DATA_MODEL.md), and what is in Version 1 in [SCOPE.md](SCOPE.md).

## Conventions

- **Format:** requests and responses are JSON.
- **Goal IDs and sub-goal IDs** are the `_id` values from the data model. An ID that is not a valid ID is refused with `400`.
- **Action routes:** completing, unmarking, archiving, and unarchiving each have their own route (for example `POST /goals/:goalId/complete`), not a field you edit. This keeps each rule's refusal message clear.
- **Changing sub-goals returns the whole updated goal,** because a sub-goal change can also change the goal (Goals Rule 4, Sub-goals Rule 5).
- **Repeating an action is refused.** An action that would change nothing, such as archiving a goal that is already archived, is refused with `409` and a message saying the item is already in that state.

### Status codes

| Code | Meaning |
|---|---|
| `200` | Success, with a response body |
| `201` | Created |
| `204` | Success, no body (deleting a goal) |
| `400` | The request is malformed or breaks a validation rule (missing title, title too long, invalid ID) |
| `404` | The goal or sub-goal does not exist |
| `409` | The request is valid, but a rule refuses it in the goal's current state (Inactive goal, unfinished sub-goals, sub-goal limit reached, or the item is already in the state the action would put it in) |

### Error format

```json
{ "error": "A short message explaining what went wrong" }
```

### Goal response shape

Progress is calculated on each request and never stored (Sub-goals Rules 3 and 4).

```json
{
  "_id": "665f1c2e9b1d8a0012a4c111",
  "title": "Get fit by December",
  "completed": false,
  "completedAt": null,
  "archived": false,
  "subGoals": [
    { "_id": "665f1c2e9b1d8a0012a4c222", "title": "Gym 3x a week", "completed": true, "createdAt": "2026-10-18T10:00:00.000Z" },
    { "_id": "665f1c2e9b1d8a0012a4c333", "title": "Meal prep on Sundays", "completed": false, "createdAt": "2026-10-18T10:05:00.000Z" }
  ],
  "progress": { "completed": 1, "total": 2 },
  "createdAt": "2026-10-18T09:55:00.000Z",
  "updatedAt": "2026-10-18T10:05:00.000Z"
}
```

---

## Goals

#### ***Create a goal***
- `POST /goals`
- **Body:** `{ "title": "Get fit by December" }`
- **Does:** Creates an Active, incomplete goal with no sub-goals. Dates are set automatically.
- **Success:** `201` with the new goal.
- **Errors:** `400` if the title is missing, empty, or longer than 100 characters.
- **Rules:** Goals Rule 8, Limits Rule 2.

#### ***List goals***
- `GET /goals` or `GET /goals?archived=true`
- **Does:** Returns Active goals by default, or Inactive goals when `archived=true`. This gives you the Active list and the Archive list.
- **Success:** `200` with a list of goals, including each goal's progress.
- **Errors:** `400` if `archived` is anything other than `true` or `false`.
- **Rules:** Archiving Rules 1 to 4.

#### ***Get one goal***
- `GET /goals/:goalId`
- **Does:** Returns one goal with its sub-goals and progress.
- **Success:** `200` with the goal.
- **Errors:** `400` for an invalid ID, `404` if not found.

#### ***Rename or edit a goal***
- `PATCH /goals/:goalId`
- **Body:** `{ "title": "Get fit by January" }`
- **Does:** Changes the title. Allowed on Active and Inactive goals, since Inactive goals are "read and edit only."
- **Success:** `200` with the updated goal.
- **Errors:** `400` for a missing, empty, or too-long title, `404` if not found.
- **Rules:** Goals Rules 5, 6 and 8.

#### ***Delete a goal***
- `DELETE /goals/:goalId`
- **Does:** Deletes the goal and all of its sub-goals. Works on Active and Inactive goals.
- **Success:** `204`.
- **Errors:** `404` if not found.
- **Rules:** Goals Rules 7 and 9.

---

## Completing and archiving a goal

#### ***Mark a goal complete***
- `POST /goals/:goalId/complete`
- **Does:** Marks the goal complete and records `completedAt`.
- **Success:** `200` with the updated goal.
- **Errors:**
  - `409` if the goal has sub-goals and any are unfinished (the message says unfinished sub-goals remain).
  - `409` if the goal is Inactive.
  - `409` if the goal is already complete.
  - `404` if not found.
- **Rules:** Goals Rules 1, 2, 3 and 6.

#### ***Unmark a goal as complete***
- `POST /goals/:goalId/uncomplete`
- **Does:** Marks the goal not complete and clears `completedAt`.
- **Success:** `200` with the updated goal.
- **Errors:** `409` if the goal is Inactive or is not complete, `404` if not found.
- **Rules:** Goals Rules 3 and 6.

#### ***Archive a goal***
- `POST /goals/:goalId/archive`
- **Does:** Moves the goal to Inactive, whether or not it is complete. Completion is not changed.
- **Success:** `200` with the updated goal.
- **Errors:** `409` if the goal is already Inactive, `404` if not found.
- **Rules:** Archiving Rules 1 to 3.

#### ***Unarchive a goal***
- `POST /goals/:goalId/unarchive`
- **Does:** Moves the goal back to Active. Completion is not changed.
- **Success:** `200` with the updated goal.
- **Errors:** `409` if the goal is already Active, `404` if not found.
- **Rules:** Archiving Rules 2 and 3.

---

## Sub-goals

Sub-goals are stored inside their goal, so every sub-goal route includes the goal's ID. There is no separate "list sub-goals" route, because `GET /goals/:goalId` already returns them. All changes below work only while the goal is Active.

#### ***Add a sub-goal***
- `POST /goals/:goalId/subgoals`
- **Body:** `{ "title": "Run a 5k" }`
- **Does:** Adds an unfinished sub-goal. If the goal was complete, it is automatically unmarked and its `completedAt` is cleared.
- **Success:** `201` with the updated goal.
- **Errors:** `400` for a missing, empty, or too-long title. `409` if the goal is Inactive or already has 20 sub-goals. `404` if the goal is not found.
- **Rules:** Sub-goals Rules 2 and 5, Limits Rules 1 and 2.

#### ***Edit a sub-goal***
- `PATCH /goals/:goalId/subgoals/:subGoalId`
- **Body:** `{ "title": "Run a 10k" }`
- **Does:** Changes the sub-goal's title.
- **Success:** `200` with the updated goal.
- **Errors:** `400` for a missing, empty, or too-long title. `409` if the goal is Inactive. `404` if the goal or sub-goal is not found.
- **Rules:** Sub-goals Rule 2.

#### ***Delete a sub-goal***
- `DELETE /goals/:goalId/subgoals/:subGoalId`
- **Does:** Removes the sub-goal. The goal's completed state does not change, and if it was the last sub-goal, the goal then counts as one item.
- **Success:** `200` with the updated goal.
- **Errors:** `409` if the goal is Inactive. `404` if the goal or sub-goal is not found.
- **Rules:** Sub-goals Rules 2, 4 and 6.

#### ***Check a sub-goal***
- `POST /goals/:goalId/subgoals/:subGoalId/check`
- **Does:** Marks the sub-goal done. It does not complete the goal, because completing a goal is always a separate action.
- **Success:** `200` with the updated goal.
- **Errors:** `409` if the goal is Inactive or the sub-goal is already done. `404` if the goal or sub-goal is not found.
- **Rules:** Sub-goals Rules 2 and 3.

#### ***Uncheck a sub-goal***
- `POST /goals/:goalId/subgoals/:subGoalId/uncheck`
- **Does:** Marks the sub-goal not done. If the goal was complete, it is automatically unmarked and its `completedAt` is cleared.
- **Success:** `200` with the updated goal.
- **Errors:** `409` if the goal is Inactive or the sub-goal is not done. `404` if the goal or sub-goal is not found.
- **Rules:** Goals Rule 4, Sub-goals Rule 2.

---

## Summary

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

That is 14 endpoints, covering every item in Version 1.

---

## Not in Version 1

- No sorting or filtering of goal lists beyond `archived` (Nice to have in SCOPE.md).
- No deadline fields or deadline routes.
- No login or user routes, since Perfectum is single-user.