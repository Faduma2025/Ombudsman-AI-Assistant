import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryStats } from '../../types/category';
import { Card } from '../common/Card';

interface CategoryCardProps {
  stats: CategoryStats;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ stats }) => {
  const navigate = useNavigate();
  const { category, totalCases, applicantWins, bankWins, partialWins } = stats;

  const applicantWinRate = totalCases > 0 ? ((applicantWins + partialWins) / totalCases * 100).toFixed(0) : 0;

  return (
    <Card
      hoverable
      onClick={() => navigate(`/category/${category.id}`)}
      className="border-l-4"
      style={{ borderLeftColor: category.color }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {category.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {category.description}
          </p>
        </div>
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center ml-4"
          style={{ backgroundColor: `${category.color}20` }}
        >
          <span className="text-2xl font-bold" style={{ color: category.color }}>
            {category.id}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Total Cases</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">{totalCases}</span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
          <div
            className="h-2.5 rounded-full"
            style={{
              width: `${applicantWinRate}%`,
              backgroundColor: category.color
            }}
          ></div>
        </div>

        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Applicant: {applicantWins + partialWins}</span>
          <span>Bank: {bankWins}</span>
        </div>
      </div>
    </Card>
  );
};
