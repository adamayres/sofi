import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Type for the burndown API response
interface BurndownDataPoint {
  date: string;
  remaining: number;
}

type BurndownResponse = BurndownDataPoint[];

export function BurndownChartSection() {
  const [data, setData] = useState<BurndownResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBurndownData() {
      try {
        const response = await fetch('/api/burndown');
        if (!response.ok) {
          throw new Error('Failed to fetch burndown data');
        }
        const burndownData: BurndownResponse = await response.json();
        setData(burndownData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBurndownData();
  }, []);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Migration Burndown</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <p className="text-sm">{error}</p>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Migration Burndown</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Migration Burndown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                // Format date as MM/DD
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis
              label={{ value: 'Components Remaining', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              labelFormatter={(value) => {
                // Format date as full date in tooltip
                const date = new Date(value as string);
                return date.toLocaleDateString();
              }}
              formatter={(value: number) => [value, 'Remaining']}
            />
            <Line
              type="monotone"
              dataKey="remaining"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
