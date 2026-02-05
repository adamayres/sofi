# Phase 2: Components List

**Share this with the candidate after they've made progress on Phase 1 (Dashboard Home).**

---

## Components List Page

**Purpose:** All design system components and their migration status. The design system team uses this daily.

**Requirements:**

1. **Table** showing all components with relevant columns
   - What columns make sense? (Let candidate propose, then confirm/adjust)

2. **Status Filter** - Way to filter by migration status
   - How should the filter work? Tabs? Dropdown? (Candidate decides)

3. **Row Interaction** - Clicking a row should do something useful
   - What happens on click? (Let candidate propose)

**Wireframe:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Components                                                     │
│                                                                 │
│  [Some kind of filter/tabs for status]                         │
├─────────────────────────────────────────────────────────────────┤
│  [Table with component data]                                    │
│  - What columns?                                                │
│  - How to show status?                                          │
│  - What about breaking changes indicator?                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Interviewer Notes

**Questions to leave intentionally ambiguous:**

- Which columns to show (let them explore the API)
- How to display status (badge? text? color?)
- Whether to show blocker count or blocker details
- Tab order/naming

**Good signs:**

- Candidate explores `/api/components` to see available fields
- Asks about user needs: "Who's looking at this? What do they care about?"
- Proposes a solution and asks for feedback

**If they just build without asking:**

- That's fine, but note it for scoring
- During discussion, ask "How did you decide which columns to include?"
