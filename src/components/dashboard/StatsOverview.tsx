import React, { useMemo, useState, useEffect } from 'react';
import { Card } from '../common/Card';

interface InstitutionStats {
  totalCases: number;
  staff_favorable_full: number;
  staff_favorable_partial: number;
  institution_favorable: number;
  procedural: number;
  unknown: number;
}

interface DashboardStats {
  generated: string;
  institutions: {
    [key: string]: InstitutionStats;
  };
  overall: InstitutionStats;
}

interface StatsOverviewProps {
  selectedInstitution: 'All Institutions' | 'World Bank' | 'IMF';
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ selectedInstitution }) => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    fetch('/data/dashboard-stats.json')
      .then(res => res.json())
      .then(data => setDashboardStats(data))
      .catch(err => console.error('Error loading dashboard stats:', err));
  }, []);

  const stats = useMemo(() => {
    if (!dashboardStats) {
      return {
        totalCases: 0,
        staffFavorable: 0,
        staffFavorableFull: 0,
        staffFavorablePartial: 0,
        institutionFavorable: 0,
        procedural: 0,
        unknown: 0,
        classified: 0,
        staffFavorableRate: '0.0',
        institutionFavorableRate: '0.0'
      };
    }

    const institutionStats = selectedInstitution === 'All Institutions'
      ? dashboardStats.overall
      : dashboardStats.institutions[selectedInstitution];

    if (!institutionStats) {
      return {
        totalCases: 0,
        staffFavorable: 0,
        staffFavorableFull: 0,
        staffFavorablePartial: 0,
        institutionFavorable: 0,
        procedural: 0,
        unknown: 0,
        classified: 0,
        staffFavorableRate: '0.0',
        institutionFavorableRate: '0.0'
      };
    }

    const staffFavorable = institutionStats.staff_favorable_full + institutionStats.staff_favorable_partial;
    const institutionFavorable = institutionStats.institution_favorable;
    const classified = institutionStats.totalCases - institutionStats.unknown;

    return {
      totalCases: institutionStats.totalCases,
      staffFavorable,
      staffFavorableFull: institutionStats.staff_favorable_full,
      staffFavorablePartial: institutionStats.staff_favorable_partial,
      institutionFavorable,
      procedural: institutionStats.procedural,
      unknown: institutionStats.unknown,
      classified,
      staffFavorableRate: institutionStats.totalCases > 0
        ? (staffFavorable / institutionStats.totalCases * 100).toFixed(1)
        : '0.0',
      institutionFavorableRate: institutionStats.totalCases > 0
        ? (institutionFavorable / institutionStats.totalCases * 100).toFixed(1)
        : '0.0'
    };
  }, [dashboardStats, selectedInstitution]);

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tribunal Decisions</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalCases}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Staff Favorable</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.staffFavorable}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.staffFavorableRate}% of all decisions</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Institution Favorable</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{stats.institutionFavorable}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.institutionFavorableRate}% of all decisions</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Ruling Breakdown</p>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Staff Favorable — Full:
                </span>
                <span className="font-semibold">{stats.staffFavorableFull}</span>
              </div>
              {stats.staffFavorablePartial > 0 && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                    Staff Favorable — Partial:
                  </span>
                  <span className="font-semibold">{stats.staffFavorablePartial}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  Institution Favorable:
                </span>
                <span className="font-semibold">{stats.institutionFavorable}</span>
              </div>
              {stats.procedural > 0 && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    Procedural:
                  </span>
                  <span className="font-semibold">{stats.procedural}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                  Unknown / Unclassified:
                </span>
                <span className="font-semibold">{stats.unknown}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">Outcome Classification:</span>
          <span className="text-gray-900 dark:text-white font-semibold">
            {stats.classified} of {stats.totalCases} decisions classified
          </span>
        </div>
      </div>
    </div>
  );
};
