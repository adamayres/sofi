# AI-Augmented Coding Interview

Welcome! In this interview, you'll build a **Design System Migration Dashboard** using AI assistance.

## What You're Building

A dashboard to track the migration of a design system from v1 to v2—showing component status, app adoption, and blockers.

See **[SPEC.md](./SPEC.md)** for requirements.

---

## Getting Started

### 1. Start the dev server

```bash
npm run dev
```

The app runs at `http://localhost:5173`. The mock API is already configured.

### 2. Explore the codebase

```
src/
├── components/
│   ├── layout/        # App layout with navigation (already built)
│   └── ui/            # shadcn/ui components (ready to use)
├── features/
│   └── example/       # Example component showing patterns
├── mocks/             # Mock API (don't modify)
├── pages/             # Page shells (build here)
└── App.tsx            # Router (already configured)
```

### 3. Check the example

Look at `src/features/example/StatCard.tsx` to see:
- How to fetch data from the API
- How to handle loading states
- How to use shadcn components

### 4. Build!

Start with the Dashboard page (`src/pages/Dashboard.tsx`). Work with the interviewer to understand requirements—the spec is intentionally incomplete.

---

## Available Tools

### UI Components (shadcn/ui)

Pre-installed and ready to use:

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// ...and more
```

See all components in `src/components/ui/`.

### Charting (Recharts)

Pre-installed for charts:

```tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
```

### API Endpoints

All endpoints return JSON. Response shapes are not documented—you'll need to explore them.

| Endpoint | Description |
|----------|-------------|
| `GET /api/stats` | Dashboard stats |
| `GET /api/blockers` | Blocked items |
| `GET /api/burndown` | Burndown chart data |
| `GET /api/components` | Component list |
| `GET /api/components/:id` | Component detail |
| `GET /api/apps` | App list |
| `GET /api/apps/:id` | App detail |

---

## Tips

- **Use AI freely**—this is an AI-augmented interview. We want to see how you work with AI.
- **Ask questions**—the spec is intentionally incomplete. The interviewer will clarify requirements.
- **Explore the API**—response shapes aren't documented. Fetch the endpoints to see what's available.
- **Start simple**—get something working, then iterate.
- **Install packages if needed**—`npm install` is fine.

Good luck!
