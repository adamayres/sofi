import type { Plugin, ViteDevServer } from 'vite';
import componentsData from './data/components.json';
import appsData from './data/apps.json';
import teamsData from './data/teams.json';
import burndownData from './data/burndown.json';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Types
type ComponentStatus = 'not_started' | 'in_progress' | 'migrated' | 'deprecated';

interface Component {
  id: string;
  name: string;
  status: ComponentStatus;
  v1Package: string;
  v1Name: string;
  v2Package: string | null;
  v2Name: string | null;
  hasBreakingChanges: boolean;
  breakingChanges: string[];
  migrationNotes: string | null;
  blockers: string[];
  updatedAt: string;
}

interface App {
  id: string;
  name: string;
  team: string;
  dsVersion: string;
  migrationProgress: number;
  blockers: string[];
  componentUsage: {
    componentId: string;
    version: 'v1' | 'v2';
    usageCount: number;
  }[];
}

const components: Component[] = componentsData as Component[];
const apps: App[] = appsData as App[];

export function mockApiPlugin(): Plugin {
  return {
    name: 'mock-api',
    configureServer(server: ViteDevServer) {
      // GET /api/stats
      server.middlewares.use('/api/stats', async (_req, res) => {
        await delay(200);

        const stats = {
          components: {
            total: components.length,
            notStarted: components.filter((c) => c.status === 'not_started').length,
            inProgress: components.filter((c) => c.status === 'in_progress').length,
            migrated: components.filter((c) => c.status === 'migrated').length,
            deprecated: components.filter((c) => c.status === 'deprecated').length,
            blocked: components.filter((c) => c.blockers.length > 0).length,
          },
          apps: {
            total: apps.length,
            notStarted: apps.filter((a) => a.migrationProgress === 0).length,
            inProgress: apps.filter((a) => a.migrationProgress > 0 && a.migrationProgress < 100).length,
            fullyMigrated: apps.filter((a) => a.migrationProgress === 100).length,
            blocked: apps.filter((a) => a.blockers.length > 0).length,
          },
        };

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(stats));
      });

      // GET /api/blockers
      server.middlewares.use('/api/blockers', async (req, res) => {
        await delay(150);

        const url = new URL(req.url || '', `http://${req.headers.host}`);
        const limit = parseInt(url.searchParams.get('limit') || '10', 10);

        const blockedComponents = components
          .filter((c) => c.blockers.length > 0)
          .map((c) => ({
            id: c.id,
            name: c.name,
            type: 'component' as const,
            blockers: c.blockers,
          }));

        const blockedApps = apps
          .filter((a) => a.blockers.length > 0)
          .map((a) => ({
            id: a.id,
            name: a.name,
            type: 'app' as const,
            blockers: a.blockers,
          }));

        const allBlocked = [...blockedComponents, ...blockedApps].slice(0, limit);

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(allBlocked));
      });

      // GET /api/burndown
      server.middlewares.use('/api/burndown', async (_req, res) => {
        await delay(180);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(burndownData));
      });

      // GET /api/components/:id or /api/components
      server.middlewares.use('/api/components', async (req, res) => {
        await delay(200);

        const url = new URL(req.url || '', `http://${req.headers.host}`);
        const pathParts = url.pathname.split('/').filter(Boolean);

        // /api/components/:id
        if (pathParts.length === 3) {
          const id = pathParts[2];
          const component = components.find((c) => c.id === id);

          if (!component) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Component not found' }));
            return;
          }

          // Build usedBy data
          const usedBy = apps
            .filter((app) => app.componentUsage.some((u) => u.componentId === id))
            .map((app) => {
              const usage = app.componentUsage.find((u) => u.componentId === id)!;
              return {
                appId: app.id,
                appName: app.name,
                version: usage.version,
                usageCount: usage.usageCount,
              };
            });

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ...component, usedBy }));
          return;
        }

        // /api/components (list)
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '20', 10);
        const status = url.searchParams.get('status') as ComponentStatus | null;

        let filtered = components;
        if (status) {
          filtered = components.filter((c) => c.status === status);
        }

        const total = filtered.length;
        const totalPages = Math.ceil(total / limit);
        const start = (page - 1) * limit;
        const paged = filtered.slice(start, start + limit);

        const data = paged.map((c) => ({
          id: c.id,
          name: c.name,
          status: c.status,
          v1Package: c.v1Package,
          v1Name: c.v1Name,
          v2Package: c.v2Package,
          v2Name: c.v2Name,
          hasBreakingChanges: c.hasBreakingChanges,
          blockersCount: c.blockers.length,
        }));

        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            data,
            pagination: { page, limit, total, totalPages },
          })
        );
      });

      // GET /api/apps/:id or /api/apps
      server.middlewares.use('/api/apps', async (req, res) => {
        await delay(200);

        const url = new URL(req.url || '', `http://${req.headers.host}`);
        const pathParts = url.pathname.split('/').filter(Boolean);

        // /api/apps/:id
        if (pathParts.length === 3) {
          const id = pathParts[2];
          const app = apps.find((a) => a.id === id);

          if (!app) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'App not found' }));
            return;
          }

          // Enrich componentUsage with component details
          const componentUsage = app.componentUsage.map((usage) => {
            const component = components.find((c) => c.id === usage.componentId);
            return {
              componentId: usage.componentId,
              componentName: component?.name || 'Unknown',
              componentStatus: component?.status || 'not_started',
              version: usage.version,
              usageCount: usage.usageCount,
            };
          });

          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              id: app.id,
              name: app.name,
              team: app.team,
              dsVersion: app.dsVersion,
              migrationProgress: app.migrationProgress,
              blockers: app.blockers,
              componentUsage,
            })
          );
          return;
        }

        // /api/apps (list)
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '20', 10);
        const team = url.searchParams.get('team');
        const hasBlockers = url.searchParams.get('hasBlockers');

        let filtered = apps;
        if (team) {
          filtered = filtered.filter((a) => a.team.toLowerCase() === team.toLowerCase());
        }
        if (hasBlockers === 'true') {
          filtered = filtered.filter((a) => a.blockers.length > 0);
        }

        const total = filtered.length;
        const totalPages = Math.ceil(total / limit);
        const start = (page - 1) * limit;
        const paged = filtered.slice(start, start + limit);

        const data = paged.map((a) => ({
          id: a.id,
          name: a.name,
          team: a.team,
          dsVersion: a.dsVersion,
          migrationProgress: a.migrationProgress,
          blockersCount: a.blockers.length,
        }));

        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            data,
            pagination: { page, limit, total, totalPages },
          })
        );
      });

      // GET /api/teams
      server.middlewares.use('/api/teams', async (_req, res) => {
        await delay(100);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(teamsData));
      });
    },
  };
}
