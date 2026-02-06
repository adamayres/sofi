# Design System Migration Dashboard

Build a dashboard to track the migration of a design system from v1 to v2—both the internal component work and adoption across product teams.

---

## Context

The Design System team is migrating the component library from v1 to v2. This dashboard helps answer:

- **Design System Team:** "Which components are done? What's blocked?"
- **Product Teams:** "How's my app doing? What's left to migrate?"
- **Leadership:** "Are we on track?"

---

## Available Resources

### API Endpoints

All endpoints are mocked and ready to use at `/api/*`. You'll need to explore them to understand the response shapes.

| Endpoint                     | Description                          |
| ---------------------------- | ------------------------------------ |
| `GET /api/stats`             | Dashboard aggregate counts           |
| `GET /api/blockers?limit=10` | Items with blockers                  |
| `GET /api/burndown`          | Historical migration data            |
| `GET /api/components`        | Component list (supports pagination) |
| `GET /api/components/:id`    | Component detail                     |
| `GET /api/apps`              | App list (supports pagination)       |
| `GET /api/apps/:id`          | App detail                           |

**Note:** API response shapes are not documented. Explore the endpoints to understand the data structure.

### UI Components

[shadcn/ui](https://ui.shadcn.com/) components are pre-installed. Check `components/ui` to see what's available.

### Charting

[Recharts](https://recharts.org/) is available if you need charts.

---

## Phase 1: Dashboard Home

**Your first task:** Build the Dashboard Home page.

**Purpose:** At-a-glance migration health for leadership and the design system team.

**Requirements:**

1. **Stat Cards** - Display key metrics about the migration
   - Ask interviewer what specific stats leadership wants to see

2. **Blockers Section** - Show items that are currently blocked
   - How should blockers be displayed? (Ask interviewer for preference)

3. **Burndown Chart** - Visual representation of migration progress over time

**Wireframe:**

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │   ???    │ │   ???    │ │   ???    │ │   ???    │  ...      │
│  │  [stat]  │ │  [stat]  │ │  [stat]  │ │  [stat]  │           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Blockers                                                       │
│  []                                 │
├─────────────────────────────────────────────────────────────────┤
│  Burndown Chart                                                 │
│  [Line chart showing remaining work over time]                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tips

- Start by exploring the API to understand the data
- Ask the interviewer clarifying questions—requirements are intentionally incomplete
- Focus on working software over perfect code
- It's fine to install additional packages if needed
