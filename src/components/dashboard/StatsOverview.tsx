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
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Applicant Wins</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.applicantWins}</p>
          <p className="text-xs text-gray-500 mt-1">{stats.applicantWinRate}%</p>
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
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Partial Wins</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.partialWins}</p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.totalCases > 0 ? ((stats.partialWins / stats.totalCases) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </Card>
    </div>
  );
};
