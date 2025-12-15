import React, { useMemo } from 'react';
import { useCases } from '../../context/CasesContext';
import { Card } from '../common/Card';

export const StatsOverview: React.FC = () => {
  const { cases } = useCases();

  const stats = useMemo(() => {
    const totalCases = cases.length;
    const applicantWins = cases.filter(c => c.rulingInFavorOf === 'Applicant').length;
    const bankWins = cases.filter(c => c.rulingInFavorOf === 'Bank').length;
    const partialWins = cases.filter(c => c.rulingInFavorOf === 'Partially Applicant').length;

    return {
      totalCases,
      applicantWins,
      bankWins,
      partialWins,
      applicantWinRate: totalCases > 0 ? ((applicantWins + partialWins) / totalCases * 100).toFixed(1) : 0,
      bankWinRate: totalCases > 0 ? (bankWins / totalCases * 100).toFixed(1) : 0
    };
  }, [cases]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Cases</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalCases}</p>
        </div>
      </Card>

      <Card>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Applicant Favorable</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.applicantWins + stats.partialWins}</p>
          <p className="text-xs text-gray-500 mt-1">{stats.applicantWinRate}% (Full + Partial)</p>
        </div>
      </Card>

      <Card>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bank Wins</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.bankWins}</p>
          <p className="text-xs text-gray-500 mt-1">{stats.bankWinRate}%</p>
        </div>
      </Card>

      <Card>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Ruling Breakdown</p>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Full Applicant:
              </span>
              <span className="font-semibold">{stats.applicantWins}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                Partial:
              </span>
              <span className="font-semibold">{stats.partialWins}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                Bank:
              </span>
              <span className="font-semibold">{stats.bankWins}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
