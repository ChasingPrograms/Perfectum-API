# Perfectum: Data Model

The data Perfectum stores, with the exact field names used in the database, the API, and the docs. Behavior details live in [RULES.md](RULES.md), and what is in Version 1 lives in [SCOPE.md](SCOPE.md).



## Overview

Perfectum stores one kind of document: a **Goal**. Each goal embeds a list of **Sub-goals**.

- **Why embedded:** Deleting a goal deletes its sub-goals automatically (Goals Rule 7 and Rule 9), the "x out of n" count is just counting the list (Sub-goals Rule 3), and the cap of 20 keeps each document small.
- **Trade-off:** Changing one sub-goal means updating inside its goal, so sub-goal routes always include the goal's ID.

---

## Goal

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | automatic | Created by MongoDB |
| `title` | string | yes | Trimmed; cannot be empty; maximum 100 characters (Goals Rule 8) |
| `completed` | boolean | no | Defaults to `false` (Goals Rules 1 to 4) |
| `completedAt` | date | no | `null` until completed; set when completed; cleared when unmarked (Goals Rule 3, Archiving Rule 4) |
| `archived` | boolean | no | Defaults to `false`. `false` means Active, `true` means Inactive (Archiving Rules 1 to 3) |
| `subGoals` | list of Sub-goal | no | Defaults to an empty list; at most 20 entries (Limits Rule 1) |
| `createdAt` | date | automatic | Set once when created; never editable (Limits Rule 2) |
| `updatedAt` | date | automatic | Updated on every change |

---

## Sub-goal (embedded in a Goal)

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | automatic | Created automatically for each sub-goal |
| `title` | string | yes | Trimmed; cannot be empty; maximum 100 characters |
| `completed` | boolean | no | Defaults to `false` (checked and unchecked, Sub-goals Rule 2) |
| `createdAt` | date | automatic | Set once when created; never editable (Limits Rule 2) |

---

## Calculated values (not stored)

These are worked out each time a goal is requested, so they can never be out of date (Sub-goals Rules 3 and 4).

| Value | How it is calculated |
|---|---|
| `progress.completed` | Number of completed sub-goals. For a goal with no sub-goals: `1` if the goal is completed, otherwise `0` |
| `progress.total` | Number of sub-goals. For a goal with no sub-goals: `1` |
| Active or Inactive | Taken from the `archived` field, not stored separately |

---

## Relationships

- One goal has zero to 20 sub-goals.
- A sub-goal belongs to exactly one goal and cannot exist on its own (Sub-goals Rule 1).
- Deleting a goal removes its sub-goals with it.

---

## Settings

| Setting | Value | Where it lives |
|---|---|---|
| Maximum sub-goals per goal | 20 | One place only, such as the `.env` file or a single constant, so it can be changed without editing other code |

---

## Not in Version 1

- No deadline fields on goals or sub-goals (Nice to have in SCOPE.md).
- No user or owner field, since Perfectum is single-user.
- No completion date on sub-goals.