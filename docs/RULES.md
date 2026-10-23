# Perfectum: Rules

Decisions that define how the API behaves. 


## Goals

#### ***Goals Rule 1***
  - A goal that has at least one sub-goal can be marked complete only when all of its sub-goals are completed. Otherwise the request is refused with an error explaining that unfinished sub-goals remain.
    - ***Why:*** A goal shouldn't be marked complete while work under it is still unfinished.

#### ***Goals Rule 2***
  - A goal with no sub-goals can be marked complete directly by the user.
    - ***Why:*** A goal with no sub-goals acts as its own single item, so there is nothing else to wait for.

#### ***Goals Rule 3***
  - Completing a goal records the completion date. Unmarking a goal as complete clears that date.
    - ***Why:*** The archive shows when goals were completed, and a goal that is no longer complete shouldn't keep a completion date.

#### ***Goals Rule 4***
  - If a sub-goal on a completed goal is unchecked, the goal is automatically unmarked as complete.
    - ***Why:*** The app should stay flexible, and a goal can't be complete while one of its sub-goals isn't.

#### ***Goals Rule 5***
  - Active goals can be renamed and edited, and sub-goals can be added to them.
    - ***Why:*** Active goals are the ones the user is working on, so they need to stay changeable.

#### ***Goals Rule 6***
  - Inactive (archived) goals are read and edit only. Sub-goals cannot be added to them. Completion can only be changed while a goal is Active.
    - ***Why:*** Archived goals are a record of past goals, so they stay mostly fixed. To change one, the user unarchives it first.

#### ***Goals Rule 7***
  - Deleting a goal also deletes all of its sub-goals.
    - ***Why:*** Sub-goals have no meaning without the goal they belong to.

#### ***Goals Rule 8***
  - A goal must have a title.
    - ***Why:*** A goal with no text can't be identified or understood by the user.

#### ***Goals Rule 9***
  - An Inactive goal can be deleted without unarchiving it first. Its sub-goals are deleted with it.
    - ***Why:*** A user who no longer wants an archived goal shouldn't need extra steps, and sub-goals can't exist without their goal.


## Archiving

#### ***Archiving Rule 1***
  - A goal can be archived at any time, even if it is not complete.
    - ***Why:*** Users may want to pause a goal and come back to it later.

#### ***Archiving Rule 2***
  - Archiving moves a goal to Inactive. Unarchiving moves it back to Active. Both are manual actions, and the API never moves a goal between the two on its own.
    - ***Why:*** The user decides when a goal is paused or resumed.

#### ***Archiving Rule 3***
  - Archiving and unarchiving do not change whether a goal is complete.
    - ***Why:*** "Where a goal lives" (Active or Inactive) and "whether it is complete" are separate ideas, and keeping them separate avoids contradictions.

#### ***Archiving Rule 4***
  - Inactive goals show their completion date if they have one. Incomplete archived goals have no completion date.
    - ***Why:*** The archive is a history of past goals, and the completion date shows when each one was finished.


## Sub-goals

#### ***Sub-goals Rule 1***
  - Every sub-goal belongs to exactly one goal.
    - ***Why:*** A sub-goal is a smaller step toward its goal and has no purpose on its own.

#### ***Sub-goals Rule 2***
  - Sub-goals can be added, edited, deleted, checked, and unchecked while their goal is Active.
    - ***Why:*** Users need to adjust the steps of a goal as plans change.

#### ***Sub-goals Rule 3***
  - Progress is shown as "x out of n" sub-goals completed. It is calculated when a goal is requested and is never stored.
    - ***Why:*** Calculating it on demand means the number can never be out of date.

#### ***Sub-goals Rule 4***
  - A goal with no sub-goals counts as one item: "0 out of 1" until it is completed, then "1 out of 1".
    - ***Why:*** Every goal follows the same counting rule, with no special case in the display.

#### ***Sub-goals Rule 5***
  - Adding a new sub-goal to a completed goal automatically unmarks the goal as complete and clears its completion date.
    - ***Why:*** A new sub-goal starts unfinished, and a goal can't be complete while it has an unfinished sub-goal.

#### ***Sub-goals Rule 6***
  - Deleting the only sub-goal on a goal does not change whether the goal is complete. The goal then follows the no-sub-goals rule and counts as one item.
    - ***Why:*** Removing a step shouldn't silently change a goal's state, and a goal with no sub-goals already has a rule for how it is completed.


## Limits and validation

#### ***Limits Rule 1***
  - A goal can have at most a fixed number of sub-goals. The limit is set in one place so it can be changed without editing the rest of the code. Requests to add more are refused with an error.
    - ***Why:*** A very long list of sub-goals is hard to use and is usually several goals combined.

#### ***Limits Rule 2***
  - The creation date is set automatically when a goal or sub-goal is created and cannot be changed by the user.
    - ***Why:*** A date the user could edit would not be a reliable record.
    
#### ***Limits Rule 3***
  - An action that would change nothing, such as archiving a goal that is already archived, is refused with an error saying the item is already in that state.
    - ***Why:*** A repeated request usually means the client is out of sync, and a clear error tells it so instead of hiding the problem.