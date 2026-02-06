import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Type for the blockers API response
interface BlockerItem {
  id: string;
  name: string;
  type: 'component' | 'app';
  blockers: string[];
}

type BlockersResponse = BlockerItem[];

const BLOCKERS_LIMIT = 10;

export function BlockersSection() {
  const [data, setData] = useState<BlockersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlockers() {
      try {
        const response = await fetch(`/api/blockers?limit=${BLOCKERS_LIMIT}`);
        if (!response.ok) {
          throw new Error('Failed to fetch blockers');
        }
        const blockersData: BlockersResponse = await response.json();
        setData(blockersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlockers();
  }, []);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Blockers</CardTitle>
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
          <CardTitle>Blockers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const hasMoreBlockers = data && data.length === BLOCKERS_LIMIT;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Blockers</CardTitle>
        {hasMoreBlockers && (
          <Button variant="outline" size="sm" asChild>
            <a href="/blockers">View all</a>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {!data || data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No blockers found</p>
        ) : (
          <ul className="divide-y">
            {data.map((item) => (
              <li key={item.id} className="py-4 first:pt-0 last:pb-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={item.type === 'component' ? 'default' : 'secondary'}>
                      {item.type}
                    </Badge>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <ul className="ml-6 text-sm text-muted-foreground space-y-1">
                    {item.blockers.map((blocker, idx) => (
                      <li key={idx}>• {blocker}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
