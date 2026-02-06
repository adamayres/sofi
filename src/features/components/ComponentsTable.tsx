import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

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

interface ComponentsTableProps {
  components: ComponentItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

const STATUS_CONFIG: Record<
  ComponentStatus,
  { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }
> = {
  migrated: { label: 'Migrated', variant: 'default' },
  in_progress: { label: 'In Progress', variant: 'secondary' },
  not_started: { label: 'Not Started', variant: 'outline' },
  deprecated: { label: 'Deprecated', variant: 'destructive' },
};

export function ComponentsTable({ components, pagination, onPageChange }: ComponentsTableProps) {
  const navigate = useNavigate();

  const handleRowClick = (componentId: string) => {
    navigate(`/components/${componentId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent, componentId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(`/components/${componentId}`);
    }
  };

  const startItem = (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Component Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>V1 → V2 Package</TableHead>
              <TableHead className="text-center">Breaking Changes</TableHead>
              <TableHead className="text-center">Blockers</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {components.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No components found
                </TableCell>
              </TableRow>
            ) : (
              components.map((component) => (
                <TableRow
                  key={component.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(component.id)}
                  onKeyDown={(e) => handleKeyDown(e, component.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View details for ${component.name}`}
                >
                  <TableCell className="font-medium">{component.name}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_CONFIG[component.status].variant}>
                      {STATUS_CONFIG[component.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <code className="text-muted-foreground">{component.v1Package}</code>
                      <span className="text-muted-foreground">→</span>
                      <code className="text-foreground">
                        {component.v2Package || <span className="text-muted-foreground">—</span>}
                      </code>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {component.hasBreakingChanges && (
                      <div className="inline-flex items-center justify-center">
                        <AlertTriangle
                          className="h-5 w-5 text-yellow-600"
                          aria-label="Has breaking changes"
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {component.blockersCount > 0 && (
                      <div className="inline-flex items-center gap-1">
                        <AlertCircle
                          className="h-4 w-4 text-destructive"
                          aria-label={`${component.blockersCount} blockers`}
                        />
                        <span className="text-sm font-medium">{component.blockersCount}</span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {startItem}-{endItem} of {pagination.total} components
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            aria-label="Next page"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
