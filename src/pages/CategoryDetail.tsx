import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { useCases } from '../context/CasesContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const CategoryDetail: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { getCategoryStats, loading } = useCategories();
  const { cases } = useCases();
  const [currentPage, setCurrentPage] = useState(1);
  const casesPerPage = 5;

  const categoryIdNum = categoryId ? parseInt(categoryId) : undefined;
  const stats = categoryIdNum ? getCategoryStats(categoryIdNum) : undefined;

  const categoryCases = useMemo(() => {
    if (!categoryIdNum) return [];
    return cases.filter(c => c.ioaCategory.id === categoryIdNum);
  }, [cases, categoryIdNum]);

  // Calculate pagination
  const totalPages = Math.ceil(categoryCases.length / casesPerPage);
  const startIndex = (currentPage - 1) * casesPerPage;
  const endIndex = startIndex + casesPerPage;
  const currentCases = categoryCases.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const pieData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Applicant Wins', value: stats.applicantWins, color: '#10B981' },
      { name: 'Bank Wins', value: stats.bankWins, color: '#EF4444' },
      { name: 'Partial Wins', value: stats.partialWins, color: '#F59E0B' }
    ];
  }, [stats]);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading category details..." />;
  }

  if (!stats || !categoryIdNum) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Category not found</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const { category } = stats;

  return (
    <div>
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
          ← Back to Dashboard
        </Link>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {category.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{category.description}</p>
          </div>
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center ml-6"
            style={{ backgroundColor: `${category.color}20` }}
          >
            <span className="text-3xl font-bold" style={{ color: category.color }}>
              {category.id}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="md:col-span-2">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Ruling Distribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => {
                  const percentageValue = percent * 100;
                  return percentageValue > 5 ? `${percentageValue.toFixed(0)}%` : '';
                }}
                outerRadius={90}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '14px',
                  fontWeight: 600
                }}
                formatter={(value: number) => {
                  const total = pieData.reduce((sum, entry) => sum + entry.value, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${value} cases (${percentage}%)`;
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '13px',
                  fontWeight: 500
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
            Quick Stats
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalCases}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">Applicant</p>
              <p className="text-xl font-bold text-green-600">
                {stats.totalCases > 0 ? ((stats.applicantWins + stats.partialWins) / stats.totalCases * 100).toFixed(0) : 0}%
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">Bank</p>
              <p className="text-xl font-bold text-red-600">
                {stats.totalCases > 0 ? (stats.bankWins / stats.totalCases * 100).toFixed(0) : 0}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Lessons Learned
        </h3>
        <div className="space-y-3">
          {stats.topLessons.slice(0, 5).map((lesson, index) => (
            <div key={index} className="flex items-start">
              <span className="inline-block w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs flex items-center justify-center mr-3 mt-0.5">
                {index + 1}
              </span>
              <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">{lesson}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          All Cases in This Category ({categoryCases.length})
        </h3>
        <div className="space-y-4 mb-6">
          {currentCases.map((case_) => (
            <div
              key={case_.caseNo}
              className="border-l-4 pl-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              style={{ borderLeftColor: category.color }}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Case #{case_.caseNo}
                </h4>
                <Badge ruling={case_.rulingInFavorOf} size="sm" />
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <span className="font-medium">Claim:</span> {case_.claim}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span className="font-medium">Decision:</span> {case_.decision}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 italic">
                Lesson: {case_.lessonsLearned}
              </p>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({startIndex + 1}-{Math.min(endIndex, categoryCases.length)} of {categoryCases.length})
              </span>
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};
