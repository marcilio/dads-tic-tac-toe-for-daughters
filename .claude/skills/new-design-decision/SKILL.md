---
name: new-design-decision
description: >
  Evaluate whether a feature, bug fix, refactoring, or other change involves
  a non-obvious design decision worth capturing. If yes, create or update an
  ADR file in docs/decisions/ before or after implementation. Use this skill
  at the start of any implementation task to assess whether a decision record
  is needed, and again after implementation if an unexpected constraint or
  tradeoff was discovered.
---

# Design Decision Skill

## When to invoke

Invoke this skill at the **start** of any implementation task. Ask: would a future developer (or Claude in a new session) look at this code and reasonably make a different choice? If yes, a decision record is needed.

**Create a decision record when:**
- A non-obvious architectural choice is made (e.g. why two effects instead of one)
- A constraint rules out the obvious approach (e.g. React anti-pattern, browser API limitation)
- A deliberate tradeoff is made (e.g. easy mode is random, not weakened minimax — a UX choice)
- An approach was tried, failed, and a less obvious one was chosen instead

**Skip a decision record when:**
- The implementation is straightforward and the code speaks for itself
- It's purely additive (new UI text, style tweak, simple new field)
- The choice is explained fully by the existing conventions in CLAUDE.md

## Timing

- **Before coding:** write Context only — what problem are we solving, what constraints exist. Fill Decision and Consequences after implementation.
- **After coding:** write the full record when the right approach only became clear during implementation.
- **After an unexpected finding:** if implementation revealed a non-obvious constraint or tradeoff not anticipated upfront, add or update the record before closing the task.

## Steps

1. **Check the existing index** at `docs/decisions/README.md` — if a related decision already exists, update its Status and create a new superseding record rather than editing the old one.

2. **Determine the next sequence number:**
   ```bash
   ls docs/decisions/*.md 2>/dev/null | grep -v README | sort | tail -1
   ```
   Increment, zero-padded to 3 digits (e.g. `004`).

3. **Choose a slug** — kebab-case, describes the decision not the feature (e.g. `countdown-two-effects`, not `timed-mode`).

4. **Create `docs/decisions/NNN-slug.md`:**

```markdown
# Title of the decision

**Date:** YYYY-MM-DD  
**Status:** Accepted

## Context
Why this decision needed to be made. What problem or constraint forced a choice.

## Decision
What we chose to do and why.

## Consequences
What this rules out, what it enables, what tradeoffs it creates.
What someone would break if they "fixed" this without reading this record.
```

5. **Add one line to `docs/decisions/README.md`** under the index:
   ```
   - [NNN-slug.md](NNN-slug.md) — one-line hook naming real symbols/concepts from the code
   ```
   The hook must be specific enough to judge relevance without opening the file.

6. **If superseding an existing decision**, update the old file's Status:
   ```
   **Status:** Superseded by [NNN-new-slug.md](NNN-new-slug.md)
   ```

## Format rules

- Pad to 3 digits: `001`, `009`, `010`
- Slug is kebab-case, lowercase
- Status: `Accepted` | `Superseded by [file]` | `Deprecated`
- Never delete decision files — supersede them instead
- Date is always the current session date (YYYY-MM-DD)
- Keep sections concise — this is a reference, not an essay
