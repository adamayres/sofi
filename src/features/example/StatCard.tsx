/**
 * EXAMPLE COMPONENT
 *
 * This component demonstrates the patterns used in this codebase:
 * - Data fetching with useEffect
 * - Loading states with Skeleton
 * - TypeScript types for API responses
 * - Composition with shadcn/ui components
 *
 * Feel free to use this as a reference for your implementation.
 */

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Type for the stats API response
interface StatsResponse {
  components: {
    total: number;
    notStarted: number;
    inProgress: number;
    migrated: number;
    deprecated: number;
    blocked: number;
  };
  apps: {
    total: number;
    notStarted: number;
    inProgress: number;
    fullyMigrated: number;
    blocked: number;
  };
}

interface StatCardProps {
  label: string;
  getValue: (stats: StatsResponse) => number | string;
  format?: (value: number | string) => string;
}

export function StatCard({ label, getValue, format }: StatCardProps) {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data: StatsResponse = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (error) {
    return (
      <Card className="w-[150px]">
        <CardContent className="pt-6">
          <p className="text-sm text-destructive">Error loading</p>
        </CardContent>
      </Card>
    );
  }

  const value = stats ? getValue(stats) : 0;
  const displayValue = format ? format(value) : value;

  return (
    <Card className="w-[150px]">
      <CardContent className="pt-6 text-center">
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-16 mx-auto mb-2" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </>
        ) : (
          <>
            <p className="text-3xl font-bold">{displayValue}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Example usage:
// <StatCard
//   label="Total Components"
//   getValue={(stats) => stats.components.total}
// />
//
// <StatCard
//   label="Migrated"
//   getValue={(stats) => stats.components.migrated / stats.components.total * 100}
//   format={(value) => `${Math.round(value as number)}%`}
// />
