import { StatCard } from '@/features/example/StatCard';

// Extract the StatsResponse type from StatCard props
type StatsResponse = Parameters<
  NonNullable<React.ComponentProps<typeof StatCard>['getValue']>
>[0];

interface StatConfig {
  label: string;
  getValue: (stats: StatsResponse) => number | string;
  format?: (value: number | string) => string;
}

const statsConfig: StatConfig[] = [
  // Components Metrics
  {
    label: 'Total Components',
    getValue: (stats) => stats.components.total,
  },
  {
    label: 'Migrated',
    getValue: (stats) => stats.components.migrated,
  },
  {
    label: 'In Progress',
    getValue: (stats) => stats.components.inProgress,
  },
  {
    label: 'Not Started',
    getValue: (stats) => stats.components.notStarted,
  },
  {
    label: 'Blocked',
    getValue: (stats) => stats.components.blocked,
  },
  {
    label: 'Migration %',
    getValue: (stats) =>
      stats.components.total > 0
        ? (stats.components.migrated / stats.components.total) * 100
        : 0,
    format: (value) => `${Math.round(value as number)}%`,
  },
  // Apps Metrics
  {
    label: 'Total Apps',
    getValue: (stats) => stats.apps.total,
  },
  {
    label: 'Fully Migrated',
    getValue: (stats) => stats.apps.fullyMigrated,
  },
  {
    label: 'Apps In Progress',
    getValue: (stats) => stats.apps.inProgress,
  },
  {
    label: 'Apps Not Started',
    getValue: (stats) => stats.apps.notStarted,
  },
  {
    label: 'Blocked Apps',
    getValue: (stats) => stats.apps.blocked,
  },
];

export function StatsCardsSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {statsConfig.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          getValue={stat.getValue}
          format={stat.format}
        />
      ))}
    </div>
  );
}
