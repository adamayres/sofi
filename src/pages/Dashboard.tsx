import { StatsCardsSection } from '@/features/dashboard/StatsCardsSection';
import { BlockersSection } from '@/features/dashboard/BlockersSection';
import { BurndownChartSection } from '@/features/dashboard/BurndownChartSection';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stat Cards Section */}
      <StatsCardsSection />

      {/* Blockers Section */}
      <BlockersSection />

      {/* Burndown Chart Section */}
      <BurndownChartSection />
    </div>
  );
}