import { useState, useEffect } from 'react';
import { ComponentsTable } from '@/features/components/ComponentsTable';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';

type ComponentStatus = 'not_started' | 'in_progress' | 'migrated' | 'deprecated';

interface ComponentItem {
  id: string;
  name: string;
  status: ComponentStatus;
  v1Package: string;
  v1Name: string;
  v2Package: string | null;
  v2Name: string | null;
  hasBreakingChanges: boolean;
  blockersCount: number;
}

interface ComponentsResponse {
  data: ComponentItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const STATUS_TABS = [
  { value: 'all', label: 'All' },
  { value: 'migrated', label: 'Migrated' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'not_started', label: 'Not Started' },
  { value: 'deprecated', label: 'Deprecated' },
] as const;

export function ComponentsList() {
  const [status, setStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ComponentsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchComponents() {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: '20',
        });

        if (status !== 'all') {
          params.append('status', status);
        }

        const response = await fetch(`/api/components?${params}`);
        if (!response.ok) {
          throw new Error('Failed to fetch components');
        }

        const componentsData: ComponentsResponse = await response.json();
        setData(componentsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchComponents();
  }, [status, page]);

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Components</h1>
        <p className="text-muted-foreground mt-1">
          Track migration status of all design system components
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Filter components by status"
        className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
      >
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={status === tab.value}
            aria-controls={`tabpanel-${tab.value}`}
            onClick={() => handleStatusChange(tab.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleStatusChange(tab.value);
              }
            }}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              status === tab.value
                ? 'bg-background text-foreground shadow-sm'
                : 'hover:bg-background/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <Alert variant="destructive">
          <p className="text-sm">{error}</p>
        </Alert>
      )}

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : data ? (
        <ComponentsTable
          components={data.data}
          pagination={data.pagination}
          onPageChange={handlePageChange}
        />
      ) : null}
    </div>
  );
}
